import { IGalleryModel } from '~api/domain/galleries/interface';
import { IPutSocialLinksPayload } from '~api/domain/social/typing';
import { ITag } from '~api/domain/tags/typing';
import { FindOptionsWhere } from 'typeorm';
import { ITalentInfo } from './talent.interface';
import { IPagination } from '~api/shared';
import { BodyType, Ethnicity, EyeColor, Gender, HairColor, HairLength } from '../enums';

export interface ISaveTalentInfoPayload {
	name: string;
	mainOccupTagId: number;
	secondOccupTagId?: number;
	representative?: string;
}

export interface IUpdateTalentInfoPayload
	extends Omit<
		ITalentInfo,
		| 'userId'
		| 'user'
		| 'name'
		| 'mainOccupTagId'
		| 'socialMedia'
		| 'tags'
		| 'skillTagIds'
		| 'skills'
	> {
	name?: string;
	mainOccupTagId?: number;
}

export interface ISaveTalentSocialMediaPayload {
	socialMedia?: IPutSocialLinksPayload['items'];
}

export interface ISaveTalentSkillsPayload {
	skillTagIds?: number[];
}

export interface ISaveEducations {
	title: string;
	description: string;
}

export interface ILikeTalentPayload {
	userId: number;
	talentId: number;
}

export interface IGetTalentsParams {
	occupationTagId?: number;
	gender?: Gender;
	experienceFrom?: number;
	experienceTo?: number;
	ageFrom?: number;
	ageTo?: number;
	heightFrom?: number;
	heightTo?: number;
	weightFrom?: number;
	weightTo?: number;
	waistFrom?: number;
	waistTo?: number;
	eyeColor?: EyeColor;
	bodyType?: BodyType;
	hairColor?: HairColor;
	hairLength?: HairLength;
	nationality?: string;
	ethnicity?: Ethnicity;
	location?: string;
	skillTagIds?: number[];
}

export interface ITalentsService {
	saveInfo(userId: number, payload: ISaveTalentInfoPayload): Promise<ITalentInfo>;
	updateInfo(userId: number, payload: IUpdateTalentInfoPayload): Promise<ITalentInfo>;
	saveSocialMedia(userId: number, payload: ISaveTalentSocialMediaPayload): Promise<void>;
	saveSkills(userId: number, payload: ISaveTalentSkillsPayload): Promise<void>;
	getOneBy(
		where: FindOptionsWhere<ITalentInfo> | FindOptionsWhere<ITalentInfo>[],
	): Promise<Omit<ITalentInfo, 'socialMedia' | 'tags' | 'skillTagIds'>>;
	getOneWithRelations(userId: number): Promise<ITalentInfo>;
	getBySearchString(searchStr: string, includeIds?: number[]): Promise<ITalentInfo[]>;
	getTags(info: ITalentInfo): Promise<ITag[]>;
	getGallery(userId: number): Promise<IGalleryModel[]>;
	saveEducations(userId: number, payload: ISaveEducations[]);

	likeTalent(payload: ILikeTalentPayload): Promise<boolean>;
	getList(pagination: IPagination, params: IGetTalentsParams);
}
