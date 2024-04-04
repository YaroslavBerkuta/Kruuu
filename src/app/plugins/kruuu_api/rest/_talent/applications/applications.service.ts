import { Inject, Injectable } from '@nestjs/common';
import {
	ApplicationStatus,
	APPLICATIONS_REPOSITORY,
	IApplicationRepository,
	IApplicationService,
	APPLICATIONS_SERVICE,
} from '~api/domain/applications/typing';
import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository } from '~api/domain/galleries/interface';
import { ITagsRepository, TAGS_REPOSITORY } from '~api/domain/tags/typing';
import { IPagination, paginateAndGetMany } from '~api/shared';
import { transformFileUrl } from '~api/shared/transforms';
import { Brackets } from 'typeorm';

@Injectable()
export class TalentApplicationService {
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;
	@Inject(TAGS_REPOSITORY) private readonly tagRepository: ITagsRepository;
	@Inject(APPLICATIONS_SERVICE) private readonly applicationService: IApplicationService;

	public async create(userId: number, dto: any) {
		return await this.applicationService.create({
			talentId: userId,
			jobId: dto.jobId,
		});
	}

	public async getList(userId: number, pagination: IPagination, status: ApplicationStatus) {
		const query = await this.applicationRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.job', 'job')
			.leftJoinAndSelect('job.project', 'project')
			.where('it.talentId = :userId', { userId });

		if (status) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.status = :status', { status });
				}),
			);
		}

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		await Promise.all(
			items.map(async (it, i, arr) => {
				let file = await this.galleryRepository.findOne({
					where: { parentTable: 'jobs', parentId: String(it.jobId) },
				});

				arr[i].job.job = (await this.tagRepository.findOne({ where: { id: it.job.job } })).name;

				arr[i].job.image = file && transformFileUrl(file.fileUrl);
			}),
		);

		return { items, count };
	}
}
