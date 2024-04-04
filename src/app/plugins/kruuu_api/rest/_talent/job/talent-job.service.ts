import { Inject, Injectable } from '@nestjs/common';
import { APPLICATIONS_REPOSITORY, IApplicationRepository } from '~api/domain/applications/typing';
import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository } from '~api/domain/galleries/interface';
import { JOB_REPOSITORY } from '~api/domain/jobs/consts';
import { IJobRepository } from '~api/domain/jobs/typing';
import { ITagsRepository, TAGS_REPOSITORY } from '~api/domain/tags/typing';
import { IPagination, paginateAndGetMany, prepareSearchString } from '~api/shared';
import { transformFileUrl } from '~api/shared/transforms';
import { GetJobListPramDto } from './dto';
import { isEmpty } from 'lodash';
import * as _ from 'lodash';

@Injectable()
export class TalentJobService {
	@Inject(JOB_REPOSITORY) private readonly jobRepository: IJobRepository;
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;
	@Inject(TAGS_REPOSITORY) private readonly tagsRepository: ITagsRepository;
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;

	public async list(userId: number, pagination: IPagination, dto: GetJobListPramDto) {
		const query = await this.jobRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.project', 'project')
			.leftJoinAndSelect('it.applications', 'applications')
			.where('it.projectId = :projectId', { projectId: dto.projectId });

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

				arr[i].industryName = (
					await this.tagsRepository.findOne({
						where: { id: item.industry },
					})
				).name;

				arr[i].submit = (await this.applicationRepository.findOne({
					where: { talentId: userId, jobId: item.id },
				}))
					? true
					: false;
			}),
		);
		return { items, count };
	}

	public async getJob(id: number, userId: number) {
		const job = await this.jobRepository.findOne({
			where: { id },
			relations: {
				skills: true,
				project: true,
				measurement: true,
				appearance: true,
				residence: true,
			},
		});
		const tag = await Promise.all(
			job.skills.map(async it => await this.tagsRepository.findOne({ where: { id: it.tagId } })),
		);
		const file = await this.galleryRepository.findOne({
			where: { parentTable: 'jobs', parentId: String(job.id) },
		});

		const submitted = await this.applicationRepository.findOne({
			where: { talentId: userId, jobId: id },
		});
		return {
			...job,
			skills: tag,
			file: {
				...file,
				fileUrl: transformFileUrl(file?.fileUrl),
			},
			submitted: !isEmpty(submitted),
		};
	}

	public async getJobsLocations(pagination: IPagination) {
		const query = this.jobRepository.createQueryBuilder('it').select('it.location');

		if (pagination.searchString)
			query.andWhere('it.location ILIKE :location', {
				location: prepareSearchString(pagination.searchString),
			});
		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		const locations = [];
		items.map(it => {
			if (it.location && !_.some(locations, loc => loc === it.location.toLowerCase()))
				locations.push(it.location.toLowerCase());
		});

		return {
			items: locations,
			count: count - (items.length - locations.length),
		};
	}
}
