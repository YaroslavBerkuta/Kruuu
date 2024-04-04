import { Inject, Injectable } from '@nestjs/common';
import {
	IGetTalentsParams,
	ILikeTalentPayload,
	ISaveEducations,
	ISaveTalentInfoPayload,
	ISaveTalentSkillsPayload,
	ISaveTalentSocialMediaPayload,
	ITalentInfo,
	ITalentLikeRepository,
	ITalentsInfoRepository,
	ITalentsService,
	IUpdateTalentInfoPayload,
} from '../typing';
import { TALENTS_INFO_REPOSITORY, TALENT_LIKE_REPOSITORY } from '../typing/consts';
import * as _ from 'lodash';
import { Brackets, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { ISocialLinksService, SOCIAL_LINKS_SERVICE } from '~api/domain/social/typing';
import { TalentsSkillsService } from './talents-skills.service';
import { Events, IPagination, paginateAndGetMany, prepareSearchString } from '~api/shared';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryModel, IGalleryService } from '~api/domain/galleries/interface';
import { ITag, ITagsService, TagDto, TAGS_SERVICE } from '~api/domain/tags/typing';
import { plainToInstance } from 'class-transformer';
import { IUsersService, USERS_SERVICE, UserStatus } from '~api/domain/users/typing';
import { compact } from 'lodash';
import { TalentsEducationService } from './talents-educations.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';

@Injectable()
export class TalentsService implements ITalentsService {
	@Inject(TALENTS_INFO_REPOSITORY) private readonly talentsInfoRepository: ITalentsInfoRepository;
	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;

	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;
	@Inject(USERS_SERVICE) private readonly userService: IUsersService;
	@Inject(TAGS_SERVICE) private readonly tagsService: ITagsService;

	@Inject(TALENT_LIKE_REPOSITORY) private readonly talentLikeRepository: ITalentLikeRepository;

	constructor(
		private readonly talentsSkillsService: TalentsSkillsService,

		private readonly talentsEducationService: TalentsEducationService,
		private eventEmitter: EventEmitter2,
	) {}

	private async updateProgressFillProfile(userId: number) {
		const columnCount = await this.talentsInfoRepository.metadata.columns.length;
		const employer = await this.talentsInfoRepository.findOneBy({ userId });

		await this.userService.changeFillProgress(
			userId,
			columnCount,
			compact(Object.values(employer)).length,
		);
	}

	public async saveInfo(userId: number, payload: ISaveTalentInfoPayload) {
		const existTalent = await this.talentsInfoRepository.findOneBy({ userId });
		if (existTalent) await this.updateInfo(userId, payload);
		else await this.talentsInfoRepository.save({ userId, ...payload });
		await this.updateProgressFillProfile(userId);

		return this.talentsInfoRepository.findOneBy({ userId });
	}

	public async updateInfo(userId: number, payload: IUpdateTalentInfoPayload) {
		const existTalent = await this.talentsInfoRepository.findOneBy({ userId });
		if (!existTalent) await this.talentsInfoRepository.save({ userId, ...payload });
		else await this.talentsInfoRepository.update(userId, payload);

		await this.updateProgressFillProfile(userId);

		return this.talentsInfoRepository.findOneBy({ userId });
	}

	public async saveSocialMedia(userId: number, payload: ISaveTalentSocialMediaPayload) {
		await this.socialLinksService.put({
			parentId: userId,
			parentType: 'talent',
			items: payload.socialMedia,
		});
	}

	public async saveEducations(userId: number, payload: ISaveEducations[]) {
		await this.talentsEducationService.save(userId, payload);
	}

	public async saveSkills(userId: number, payload: ISaveTalentSkillsPayload) {
		await this.talentsSkillsService.save(userId, payload.skillTagIds);
	}

	public async getOneBy(where: FindOptionsWhere<ITalentInfo> | FindOptionsWhere<ITalentInfo>[]) {
		return this.talentsInfoRepository.findOneBy(where);
	}

	public async getOneWithRelations(userId: number) {
		const info = await this.talentsInfoRepository
			.createQueryBuilder('it')
			.where('it.userId = :userId', { userId })
			.leftJoinAndSelect('it.skills', 'skills')
			.leftJoinAndSelect('it.educations', 'educations')
			.getOne();

		if (info)
			info.gallery = await this.galleryService.get({
				parentId: userId,
				parentTable: 'talents',
			});

		return info;
	}

	public async getBySearchString(searchStr: string, includeIds?: number[]) {
		if (!searchStr) return [];

		const query = this.talentsInfoRepository.createQueryBuilder('it').where('it.name ILIKE :name', {
			name: prepareSearchString(searchStr),
		});

		if (!_.isEmpty(includeIds)) query.andWhere('it.userId IN (:...includeIds)', { includeIds });

		return query.getMany();
	}

	public async getTags(talent: ITalentInfo): Promise<ITag[]> {
		const tagIds = [talent.mainOccupTagId, talent.secondOccupTagId].filter(it => !_.isNil(it));
		if (!_.isEmpty(talent.skills)) {
			const skillTagIds = [];
			talent.skills.map(it => skillTagIds.push(it.skillTagId));
			talent.skillTagIds = skillTagIds;
			tagIds.push(...skillTagIds);
		}

		const tags = await this.tagsService.getByIds(_.uniq(tagIds));
		return plainToInstance(TagDto, tags);
	}

	public async getGallery(userId: number): Promise<IGalleryModel[]> {
		return await this.galleryService.get({
			parentId: userId,
			parentTable: 'talents',
		});
	}

	public async likeTalent(payload: ILikeTalentPayload) {
		const exist = await this.talentLikeRepository.findOne({
			where: { employerId: payload.userId, talentId: payload.talentId },
		});
		if (exist) {
			await this.talentLikeRepository.delete(exist.id);
			this.eventEmitter.emit(Events.LikeTalent, {
				employerId: payload.userId,
				talentId: payload.talentId,
				like: false,
			});
			return false;
		}
		await this.talentLikeRepository.save({
			employerId: payload.userId,
			talentId: payload.talentId,
		});
		this.eventEmitter.emit(Events.LikeTalent, {
			employerId: payload.userId,
			talentId: payload.talentId,
			like: true,
		});
		return true;
	}

	public async getList(pagination: IPagination, params: IGetTalentsParams = {}) {
		const query = this.talentsInfoRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.user', 'user')
			.orderBy('user.updatedAt', 'DESC')
			.where('user.status = :status', { status: UserStatus.Active });

		if (pagination.searchString) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.name ILIKE :searchString', {
						searchString: prepareSearchString(pagination.searchString),
					});
					qb.orWhere('it.location ILIKE :searchString');
				}),
			);
		}

		this.addParams(query, params);
		return await paginateAndGetMany(query, pagination, 'it');
	}

	private addParams(query: SelectQueryBuilder<ITalentInfo>, params: IGetTalentsParams) {
		if (params.occupationTagId)
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.mainOccupTagId = :occupationTagId', {
						occupationTagId: params.occupationTagId,
					});
					qb.orWhere('it.secondOccupTagId = :occupationTagId', {
						occupationTagId: params.occupationTagId,
					});
				}),
			);

		if (params.gender) query.andWhere('it.gender = :gender', { gender: params.gender });

		if (params.experienceFrom)
			query.andWhere('it.experience >= :minExperience', {
				minExperience: params.experienceFrom,
			});

		if (params.experienceTo)
			query.andWhere('it.experience <= :maxExperience', {
				maxExperience: params.experienceTo,
			});

		if (params.ageFrom) {
			const minBirthDate = moment().subtract(params.ageFrom, 'years').endOf('day');
			query.andWhere('it.dateOfBirth <= :minBirthDate', { minBirthDate });
		}

		if (params.ageTo) {
			const maxBirthDate = moment()
				.subtract(params.ageTo, 'years')
				.subtract(1, 'year')
				.add(1, 'day')
				.startOf('day');
			query.andWhere('it.dateOfBirth >= :maxBirthDate', { maxBirthDate });
		}

		if (params.heightFrom)
			query.andWhere('it.height >= :minHeight', { minHeight: params.heightFrom });

		if (params.heightTo) query.andWhere('it.height <= :maxHeight', { maxHeight: params.heightTo });

		if (params.weightFrom)
			query.andWhere('it.weight >= :minWeight', { minWeight: params.weightFrom });

		if (params.weightTo) query.andWhere('it.weight <= :maxWeight', { maxWeight: params.weightTo });

		if (params.waistFrom) query.andWhere('it.waist >= :minWaist', { minWaist: params.waistFrom });

		if (params.waistTo) query.andWhere('it.waist <= :maxWaist', { maxWaist: params.waistTo });

		if (params.eyeColor) query.andWhere('it.eyeColor = :eyeColor', { eyeColor: params.eyeColor });

		if (params.bodyType) query.andWhere('it.bodyType = :bodyType', { bodyType: params.bodyType });

		if (params.hairColor)
			query.andWhere('it.hairColor = :hairColor', { hairColor: params.hairColor });

		if (params.hairLength)
			query.andWhere('it.hairLength = :hairLength', { hairLength: params.hairLength });

		if (params.nationality)
			query.andWhere('it.nationality = :nationality', { nationality: params.nationality });

		if (params.ethnicity)
			query.andWhere('it.ethnicity = :ethnicity', { ethnicity: params.ethnicity });

		if (params.location)
			query.andWhere('it.location ILIKE :location', { location: params.location });

		if (!_.isEmpty(params.skillTagIds)) {
			query
				.leftJoinAndSelect('it.skills', 'skills')
				.andWhere('skills.skillTagId = ANY (:skillIds)', { skillIds: params.skillTagIds });
		}
	}
}
