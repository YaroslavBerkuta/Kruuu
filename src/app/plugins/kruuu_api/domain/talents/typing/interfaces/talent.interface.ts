import { IGalleryModel } from '~api/domain/galleries/interface';
import { ISocialLink } from '~api/domain/social/typing';
import { ITag } from '~api/domain/tags/typing';
import { IUser } from '~api/domain/users/typing';
import { BodyType, Ethnicity, EyeColor, Gender, HairColor, HairLength } from '../enums';
import { ITalentEducation } from './talent-education.interface';
import { ITalentSkill } from './talent-skill.interface';
import { ITalentLike } from './talent-likes.interface';
export interface ITalentInfo {
	id?: number;
	userId: number;
	user?: IUser;
	name: string;
	mainOccupTagId: number;
	secondOccupTagId?: number;
	representative?: string;
	dateOfBirth?: string;
	gender?: Gender;
	nationalityTagId?: number;
	nationality?: string;
	ethnicity?: Ethnicity;
	location?: string;
	countryCode?: string;
	experience?: number;
	height?: number;
	weight?: number;
	eyeColor?: EyeColor;
	waist?: number;
	bodyType?: BodyType;
	hairColor?: HairColor;
	hairLength?: HairLength;
	ageFrom?: number;
	ageTo?: number;
	mobileNumber?: string;
	email?: string;
	payPerDay?: number;
	currency?: string;
	description?: string;
	qualifications?: string;
	skills?: ITalentSkill[];
	tags?: Partial<ITag>[];
	socialMedia?: ISocialLink[];
	skillTagIds?: number[];

	avatarUrl?: string;

	gallery?: IGalleryModel[];

	educations?: ITalentEducation[];

	likes?: ITalentLike[];
}
