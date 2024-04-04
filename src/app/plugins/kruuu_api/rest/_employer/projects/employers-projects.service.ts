import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { IProjectsRepository } from '~api/domain/projects/interfaces';
import { StoreProjectSocialDto, StoreProjectsPayloadDto, UpdateProjectsPayloadDto } from './dto';
import { PROJECTS_REPOSITORY, PROJECTS_SERVICES } from '~api/domain/projects/consts';
import { IProjectsService } from '~api/domain/projects/typing';
import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository } from '~api/domain/galleries/interface';
import { transformFileUrl } from '~api/shared/transforms';
import { ITagsRepository, TAGS_REPOSITORY } from '~api/domain/tags/typing';
import { JOB_REPOSITORY } from '~api/domain/jobs/consts';
import { IJobRepository } from '~api/domain/jobs/typing';
import { APPLICATIONS_REPOSITORY, IApplicationRepository } from '~api/domain/applications/typing';
import { ISocialLinksService, SOCIAL_LINKS_SERVICE } from '~api/domain/social/typing';
import { IPagination, paginateAndGetMany } from '~api/shared';
import {
	createProjectPayloadToBlockainParams,
	createProjectPayloadToUpdateProject,
} from './transforms';
import { BLOCK_API_SERVICE, IBlockApiService } from '~api/libs/blockchain/typing';

@Injectable()
export class EmployerProjectsService {
	@Inject(PROJECTS_SERVICES) private readonly projectsService: IProjectsService;
	@Inject(PROJECTS_REPOSITORY) private readonly projectsRepository: IProjectsRepository;
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;
	@Inject(TAGS_REPOSITORY) private readonly tagsRepository: ITagsRepository;
	@Inject(JOB_REPOSITORY) private readonly jobRepository: IJobRepository;
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;
	@Inject(SOCIAL_LINKS_SERVICE) private readonly socialLinkService: ISocialLinksService;
	@Inject(BLOCK_API_SERVICE) private readonly blockApi: IBlockApiService;

	public async create(_userId: number, payload: StoreProjectsPayloadDto) {
		try {
			await this.blockApi.createUserSignedTx(_userId, {
				command: 'createProject',
				params: createProjectPayloadToBlockainParams(payload),
			});
		} catch (e: any) {
			throw new BadRequestException(e.message);
		}
	}

	public async getOne(id: number) {
		const project = await this.projectsRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.jobs', 'jobs')
			.leftJoinAndSelect('jobs.applications', 'applications')
			.where('it.id = :id', { id })
			.getOne();

		const files = await this.galleryRepository.find({
			where: { parentId: String(project.id), parentTable: 'projects' },
		});

		return {
			...project,
			industry: await this.tagsRepository.findOne({ where: { id: project.industryId } }),
			type: await this.tagsRepository.findOne({ where: { id: project.typeId } }),
			socialLink: await this.getSocial(project.id),
			files: files.map(file => ({
				...file,
				fileUrl: transformFileUrl(file.fileUrl),
			})),
		};
	}

	public async delete(id: number) {
		return await this.projectsRepository.delete(id);
	}

	public async update(userId: number, id: number, payload: UpdateProjectsPayloadDto) {
		try {
			const project = await this.projectsRepository
				.createQueryBuilder('it')
				.addSelect('it.blochaineUuid')
				.where('it.id = :id', { id })
				.getOne();

			const authorDid = await this.blockApi.getUserDID(userId);

			await this.blockApi.createUserSignedTx(userId, {
				command: 'addUpdates',
				params: createProjectPayloadToUpdateProject(project, payload, authorDid),
			});
		} catch (e: any) {
			throw new BadRequestException(e.message);
		}

		// return await this.projectsService.update(id, payload);
	}

	public async list(userId: number, pagination: IPagination, employerId?: number) {
		const projects = this.projectsRepository
			.createQueryBuilder('it')
			.where('it.creatorId = :userId', { userId: userId || employerId })
			.orderBy('it.createdAt', 'DESC');

		const { items, count } = await paginateAndGetMany(projects, pagination, 'it');

		const application = this.applicationRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.job', 'jobs')
			.leftJoinAndSelect('jobs.project', 'project');

		const prepared = await Promise.all(
			items.map(async it => {
				const jobsCount = await this.jobRepository.count({ where: { projectId: it.id } });
				return {
					...it,
					jobsCount,
					applicationCount: await application.where('project.id = :id', { id: it.id }).getCount(),
				};
			}),
		);

		return { items: [...prepared], count };
	}

	public async storeSocial(id: number, payload: StoreProjectSocialDto) {
		return await this.projectsService.storeSocial(id, payload);
	}

	public async getSocial(id: number) {
		return await this.socialLinkService.get({
			parentId: id,
			parentType: 'project',
		});
	}

	public async close(userId: number, projectId: number) {
		const project = await this.projectsRepository.findOne({
			where: { id: projectId },
			select: ['blochaineUuid', 'id', 'creatorId'],
		});

		if (project.creatorId !== userId) throw new ForbiddenException('');

		await this.blockApi.createUserSignedTx(userId, {
			command: 'closeProject',
			params: {
				project: project.blochaineUuid,
			},
		});
	}
}
