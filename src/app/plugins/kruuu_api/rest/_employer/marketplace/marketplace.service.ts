import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { APPLICATIONS_REPOSITORY, IApplicationRepository } from '~api/domain/applications/typing';
import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository } from '~api/domain/galleries/interface';
import { JOB_REPOSITORY } from '~api/domain/jobs/consts';
import { IJobRepository } from '~api/domain/jobs/typing';
import { PROJECTS_REPOSITORY } from '~api/domain/projects/consts';
import { IProjectsRepository } from '~api/domain/projects/interfaces';

import { TAGS_REPOSITORY, ITagsRepository } from '~api/domain/tags/typing';
import { ITalentsService, TALENTS_INFO_SERVICE } from '~api/domain/talents/typing';

import { clearList, IPagination, paginateAndGetMany, prepareSearchString } from '~api/shared';
import { transformFileUrl } from '~api/shared/transforms';
import { Any, Brackets } from 'typeorm';
import { GetTalentsParamsDto } from './dto';
import { IProject } from '~api/domain/projects/typing';

@Injectable()
export class EmployerMarketplaceService {
	@Inject(TALENTS_INFO_SERVICE)
	private talentsInfoService: ITalentsService;

	@Inject(PROJECTS_REPOSITORY) private readonly projectsRepository: IProjectsRepository;
	@Inject(JOB_REPOSITORY) private readonly jobRepository: IJobRepository;
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;
	@Inject(TAGS_REPOSITORY) private readonly tagsRepository: ITagsRepository;
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;

	public async getTalents(_userId: number, pagination: IPagination, dto: GetTalentsParamsDto) {
		const { items, count } = await this.talentsInfoService.getList(pagination, dto);

		for await (const [index, item] of items.entries()) {
			try {
				items[index].gallery = await this.talentsInfoService.getGallery(item.userId);
				items[index].tags = await this.talentsInfoService.getTags(item);

				delete items[index].skills;
			} catch (e) {
				console.log(e);
			}
		}

		return clearList({ items, count });
	}

	public async getProjects(userId: number, pagination: IPagination) {
		const query = this.projectsRepository
			.createQueryBuilder('it')
			.orderBy('it.createdAt', 'DESC')
			.where('it.creatorId = :userId', { userId });

		if (pagination.searchString) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.title ILIKE :searchString', {
						searchString: prepareSearchString(pagination.searchString),
					});
				}),
			);
		}
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
	public async getJobs(userId: number, pagination: IPagination) {
		const query = this.jobRepository
			.createQueryBuilder('it')
			.orderBy('it.createdAt', 'DESC')
			.leftJoinAndSelect('it.project', 'project')
			.andWhere('project.creatorId = :creatorId', { creatorId: userId });

		if (pagination.searchString) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.title ILIKE :searchString', {
						searchString: prepareSearchString(pagination.searchString),
					});
				}),
			);
		}
		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		await Promise.all(
			items.map(async (item, i, arr: any) => {
				const file = await this.galleryRepository.findOne({
					where: { parentTable: 'jobs', parentId: String(item.id) },
				});

				arr[i].applications = await this.applicationRepository.find({
					where: { jobId: item.id },
				});

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
}
