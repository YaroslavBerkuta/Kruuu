import { Inject, Injectable } from '@nestjs/common';
import {
	ISocialLinksService,
	SocialLinkDto,
	SOCIAL_LINKS_SERVICE,
} from '~api/domain/social/typing';
import { ITagsService, TagDto, TAGS_SERVICE } from '~api/domain/tags/typing';
import {
	ITalentInfo,
	ITalentsInfoRepository,
	ITalentsService,
	TALENTS_INFO_REPOSITORY,
	TALENTS_INFO_SERVICE,
} from '~api/domain/talents/typing';
import { Events, IPagination, paginateAndGetMany, prepareSearchString } from '~api/shared';
import * as _ from 'lodash';
import { plainToInstance } from 'class-transformer';
import { TalentInListPlainDto } from '../dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EmployerTalentsService {
	@Inject(TALENTS_INFO_REPOSITORY) private readonly talentsInfoRepository: ITalentsInfoRepository;
	@Inject(TAGS_SERVICE) private readonly tagsService: ITagsService;
	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;
	@Inject(TALENTS_INFO_SERVICE)
	private readonly talentsService: ITalentsService;

	constructor(private readonly eventEmmiter: EventEmitter2) {}

	public async getList(pagination: IPagination) {
		const query = this.talentsInfoRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.skills', 'skills');

		if (pagination.searchString)
			query.andWhere('it.name ILIKE :name', {
				name: prepareSearchString(pagination.searchString),
			});

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');
		const preparedItems = await this.prepareItems(items);
		return { items: plainToInstance(TalentInListPlainDto, preparedItems), count };
	}

	public async getDetails(userId: number, id: number) {
		const talent = await this.talentsInfoRepository
			.createQueryBuilder('it')
			.where('it.userId = :id', { id })
			.leftJoinAndSelect('it.educations', 'educations')
			.leftJoinAndSelect('it.skills', 'skills')
			.leftJoinAndSelect('it.likes', 'likes')
			.getOne();

		if (!talent) return null;

		await this.eventEmmiter.emit(Events.ViewTalent, {
			employerId: userId,
			talentId: talent.userId,
		});

		talent.gallery = await this.talentsService.getGallery(talent.userId);

		return this.prepareDetails(talent);
	}

	private async prepareItems(items: ITalentInfo[]) {
		if (_.isEmpty(items)) return items;

		const tagIds = [];
		items.map(it => {
			if (it.mainOccupTagId) tagIds.push(it.mainOccupTagId);
			if (it.secondOccupTagId) tagIds.push(it.secondOccupTagId);
		});
		if (_.isEmpty(tagIds)) return items;

		const tags = await this.tagsService.getByIds(_.uniq(tagIds));
		items.map(
			it =>
				(it.tags = plainToInstance(
					TagDto,
					tags.filter(tag => tag.id === it.mainOccupTagId || tag.id === it.secondOccupTagId),
				)),
		);

		return items;
	}

	private async prepareDetails(talent: ITalentInfo) {
		const tagIds = [talent.mainOccupTagId, talent.secondOccupTagId].filter(it => !_.isNil(it));
		if (!_.isEmpty(talent.skills)) {
			const skillTagIds = [];
			talent.skills.map(it => skillTagIds.push(it.skillTagId));
			talent.skillTagIds = skillTagIds;
			tagIds.push(...skillTagIds);
		}

		const tags = await this.tagsService.getByIds(_.uniq(tagIds));
		talent.tags = plainToInstance(TagDto, tags);

		const socialMedia = await this.socialLinksService.get({
			parentType: 'talent',
			parentId: talent.userId,
		});
		talent.socialMedia = plainToInstance(SocialLinkDto, socialMedia);

		return talent;
	}

	public async likeTalent(userId: number, talentId: number) {
		return this.talentsService.likeTalent({ userId, talentId });
	}

	public async getTalentsLocations(pagination: IPagination) {
		const query = this.talentsInfoRepository.createQueryBuilder('it').select('it.location');

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
