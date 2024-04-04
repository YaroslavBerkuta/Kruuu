import { Inject, Injectable } from '@nestjs/common';

import * as _ from 'lodash';
import { APPLICATIONS_REPOSITORY, IApplicationRepository } from '~api/domain/applications/typing';
import { EMPLOYERS_INFO_REPOSITORY, IEmployersInfoRepository } from '~api/domain/employer/typing';
import { GALLERY_REPOSITORY, GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleriesRepository, IGalleryService } from '~api/domain/galleries/interface';
import { JOB_REPOSITORY } from '~api/domain/jobs/consts';
import { IJob, IJobRepository } from '~api/domain/jobs/typing';
import { PROJECTS_REPOSITORY } from '~api/domain/projects/consts';
import { IProjectsRepository } from '~api/domain/projects/interfaces';

import { ISocialLinksService, SOCIAL_LINKS_SERVICE } from '~api/domain/social/typing';
import { ITagsRepository, TAGS_REPOSITORY } from '~api/domain/tags/typing';
import {
	IPagination,
	paginateAndGetMany,
	prepareSearchString,
	transformFileUrl,
} from '~api/shared';

import { Any, Brackets, SelectQueryBuilder } from 'typeorm';
import { GetJobsParamsDto, GetProjectsParamsDto } from './dto';
import { IProject } from '~api/domain/projects/typing';
import { ProjectStatus } from '~api/domain/projects/typing/enums';

@Injectable()
export class TalentMarketplaceService {
	@Inject(PROJECTS_REPOSITORY) private readonly projectsRepository: IProjectsRepository;
	@Inject(EMPLOYERS_INFO_REPOSITORY)
	private readonly employersRepository: IEmployersInfoRepository;
	@Inject(JOB_REPOSITORY) private readonly jobRepository: IJobRepository;
	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;
	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;
	@Inject(TAGS_REPOSITORY) private readonly tagsRepository: ITagsRepository;
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;

	public async getProjects(pagination: IPagination, dto: GetProjectsParamsDto = {}) {
		const query = this.projectsRepository
			.createQueryBuilder('it')
			.orderBy('it.createdAt', 'DESC')
			.where('it.status = :status', { status: ProjectStatus.InProgress });

		if (pagination.searchString) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.title ILIKE :searchString', {
						searchString: prepareSearchString(pagination.searchString),
					});
				}),
			);
		}

		if (dto.employerId) query.andWhere('it.creatorId = :creatorId', { creatorId: dto.employerId });

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		const prepared: (IProject & { jobsCount: number })[] = await Promise.all(
			items.map(async (it, i, arr) => {
				const files = await this.galleryRepository.find({
					where: { parentId: String(it.id), parentTable: 'projects' },
				});
				const jobsCount = await this.jobRepository.count({ where: { projectId: it.id } });
				return {
					...arr[i],
					industry: await this.tagsRepository.findOne({ where: { id: it.industryId } }),
					type: await this.tagsRepository.findOne({ where: { id: it.typeId } }),
					files: files.map(file => ({
						...file,
						fileUrl: transformFileUrl(file.fileUrl),
					})),
					jobsCount,
				};
			}),
		);

		return { items: prepared, count };
	}

	public async getEmployers(pagination: IPagination) {
		const query = this.employersRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.user', 'us');

		if (pagination.searchString) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.name ILIKE :searchString', {
						searchString: prepareSearchString(pagination.searchString),
					});
				}),
			);
		}
		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		const prepared = await Promise.all(
			items.map(async it => {
				const socialMedia = await this.socialLinksService.get({
					parentType: 'employer',
					parentId: it.userId,
				});

				const gallery = await this.galleryService.get({
					parentId: it.userId,
					parentTable: 'employers',
				});

				const jobsCount = await this.jobRepository
					.createQueryBuilder('it')
					.orderBy('it.createdAt', 'DESC')
					.leftJoinAndSelect('it.project', 'project')
					.andWhere('project.creatorId = :creatorId', { creatorId: it.userId })
					.getCount();

				return {
					...it,
					socialMedia,
					gallery,
					jobsCount,
				};
			}),
		);

		return { items: prepared, count };
	}

	public async getJobs(userId: number, pagination: IPagination, dto: GetJobsParamsDto = {}) {
		const query = this.jobRepository
			.createQueryBuilder('it')
			.orderBy('it.createdAt', 'DESC')
			.leftJoinAndSelect('it.project', 'project')
			.where('project.status = :status', { status: ProjectStatus.InProgress });

		if (pagination.searchString) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.title ILIKE :searchString', {
						searchString: prepareSearchString(pagination.searchString),
					});
				}),
			);
		}

		this.addJobsSearchParams(query, dto);

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		await Promise.all(
			items.map(async (item, i, arr: any) => {
				const file = await this.galleryRepository.findOne({
					where: { parentTable: 'jobs', parentId: String(item.id) },
				});

				arr[i].submit = (await this.applicationRepository.findOne({
					where: { talentId: userId, jobId: item.id },
				}))
					? true
					: false;

				if (file) {
					arr[i].image = transformFileUrl(file.fileUrl);
				}

				const tags = await this.tagsRepository.findBy({
					id: Any([item.industry, item.job]),
				});

				const industryTag = _.find(tags, tag => tag.id === item.industry);
				if (industryTag) arr[i].industryName = industryTag.name;

				const jobTag = _.find(tags, tag => tag.id === item.job);
				if (jobTag) arr[i].jobName = jobTag.name;
			}),
		);

		return { items, count };
	}

	private addJobsSearchParams(query: SelectQueryBuilder<IJob>, params: GetJobsParamsDto) {
		if (params.employerId)
			query.andWhere('project.creatorId = :creatorId', { creatorId: params.employerId });

		if (params.currency) query.andWhere('it.currency = :currency', { currency: params.currency });

		if (params.feeFrom)
			query.andWhere('it.payment::numeric >= :feeFrom', { feeFrom: params.feeFrom });

		if (params.feeTo) query.andWhere('it.payment::numeric <= :feeTo', { feeTo: params.feeTo });

		if (params.industryTagId)
			query.andWhere('it.industry = :industry', { industry: params.industryTagId });

		if (params.typeTagId) query.andWhere('it.type = :type', { type: params.typeTagId });

		if (params.experience)
			query.andWhere('it.experience = ANY(:experience)', { experience: params.experience });

		if (params.duration)
			query.andWhere('it.duration = ANY(:duration)', { duration: params.duration });

		if (params.location)
			query.andWhere('it.location ILIKE :location', { location: params.location });
	}
}
