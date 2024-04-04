import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { APPLICATIONS_REPOSITORY, IApplicationRepository } from '~api/domain/applications/typing';
import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository } from '~api/domain/galleries/interface';
import { JOB_REPOSITORY, JOB_SERVICES } from '~api/domain/jobs/consts';
import { IJobRepository, IJobService } from '~api/domain/jobs/typing';
import { ITagsRepository, TAGS_REPOSITORY } from '~api/domain/tags/typing';
import { IPagination, paginateAndGetMany } from '~api/shared';
import { transformFileUrl } from '~api/shared/transforms';
import { Brackets } from 'typeorm';
import { StoreJobDto, UpdateJobDto } from './dto';
import { BLOCK_API_SERVICE, IBlockApiService } from '~api/libs/blockchain/typing';
import { PROJECTS_REPOSITORY } from '~api/domain/projects/consts';
import { IProjectsRepository } from '~api/domain/projects/interfaces';
import { FinishJobPayloadDto } from './dto/finish-job.dto';

@Injectable()
export class EmployerJobsService {
	@Inject(JOB_SERVICES) private readonly jobServices: IJobService;
	@Inject(JOB_REPOSITORY) private readonly jobRepository: IJobRepository;
	@Inject(TAGS_REPOSITORY) private readonly tagsRepository: ITagsRepository;
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;
	@Inject(BLOCK_API_SERVICE) private readonly blockApi: IBlockApiService;
	@Inject(PROJECTS_REPOSITORY) private readonly projectsRepository: IProjectsRepository;

	public async store(userId: number, dto: StoreJobDto) {
		const project = await this.projectsRepository.findOne({
			where: { id: dto.projectId },
			select: ['creatorId'],
		});
		if (!project || project.creatorId !== userId) throw new NotFoundException('Project not exist');

		return await this.jobServices.storeJob(dto);
	}

	public async remove(id: number) {
		await this.jobRepository.delete(id);
	}

	public async getOne(id: number) {
		const job = await this.jobServices.getOneJob(id);
		const jobFiles = await this.galleryRepository.find({
			where: { parentTable: 'jobs', parentId: String(job.id) },
		});
		const result = {
			...job,
			files: jobFiles.map(file => ({
				...file,
				fileUrl: transformFileUrl(file.fileUrl),
			})),
		};
		return result;
	}

	public async update(id: number, dto: UpdateJobDto) {
		return await this.jobServices.updateJob(id, dto);
	}

	public async getList(id: number, pagination: IPagination, projectId: number) {
		const query = this.jobRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.project', 'project')
			.leftJoinAndSelect('it.applications', 'applications')
			.where('project.creatorId = :creatorId', { creatorId: id });

		if (projectId) {
			query.andWhere(new Brackets(qb => qb.where('it.projectId = :projectId', { projectId })));
		}

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		await Promise.all(
			items.map(async (item, i, arr: any) => {
				const file = await this.galleryRepository.findOne({
					where: { parentTable: 'jobs', parentId: String(item.id) },
				});

				arr[i].type = (await this.tagsRepository.findOne({ where: { id: item.job } })).name;

				if (file) {
					arr[i].image = transformFileUrl(file.fileUrl);
				}
				arr[i].applications = await this.applicationRepository.find({
					where: { jobId: item.id },
				});

				arr[i].jobName = (await this.tagsRepository.findOne({ where: { id: item.job } })).name;
			}),
		);
		return { items, count };
	}

	public async finishJob(userId: number, dto: FinishJobPayloadDto) {
		const job = await this.jobRepository.findOne({
			where: {
				id: dto.jobId,
			},
			select: ['projectId', 'blochaineUuid', 'id'],
		});

		const project = await this.projectsRepository.findOne({
			where: {
				id: job.projectId,
			},
		});

		if (project.creatorId !== userId) throw new ForbiddenException();

		await this.blockApi.createUserSignedTx(userId, {
			command: 'finishJob',
			params: {
				job: job.blochaineUuid,
			},
		});
	}
}
