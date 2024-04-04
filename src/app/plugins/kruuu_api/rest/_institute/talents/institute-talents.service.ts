import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { isEmpty, uniq } from 'lodash';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import { ITagsService, TAGS_SERVICE, TagDto } from '~api/domain/tags/typing';
import { ITalentsInfoRepository, TALENTS_INFO_REPOSITORY } from '~api/domain/talents/typing';
import { IPagination, paginateAndGetMany, prepareSearchString } from '~api/shared';

@Injectable()
export class InstituteTalentsService {
	@Inject(TALENTS_INFO_REPOSITORY) private readonly talentInfoRepository: ITalentsInfoRepository;
	@Inject(TAGS_SERVICE) private readonly tagsService: ITagsService;
	@Inject(GALLERY_SERVICE) private readonly galleryService: IGalleryService;

	private async prepareItems(items: any[]) {
		if (isEmpty(items)) return items;

		const tagIds = [];
		items.map(it => {
			if (it.mainOccupTagId) tagIds.push(it.mainOccupTagId);
			if (it.secondOccupTagId) tagIds.push(it.secondOccupTagId);
		});
		if (isEmpty(tagIds)) return items;

		const tags = await this.tagsService.getByIds(uniq(tagIds));
		items.map(
			it =>
				(it.tags = plainToInstance(
					TagDto,
					tags.filter(tag => tag.id === it.mainOccupTagId || tag.id === it.secondOccupTagId),
				)),
		);

		return items;
	}

	public async getTalentsList(pagination: IPagination) {
		const query = this.talentInfoRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.skills', 'skills');

		if (pagination.searchString)
			query.andWhere('it.name ILIKE :name', {
				name: prepareSearchString(pagination.searchString),
			});

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		await Promise.all(
			items.map(async (it, index: number, arr: any[]) => {
				arr[index].gallery = await this.galleryService.get({
					parentId: it.userId,
					parentTable: 'talents',
				});
			}),
		);

		return { items: await this.prepareItems(items), count };
	}
}
