import { SocialLinkResponseDto } from '~api/domain/social/typing';
import { TagResponseDto } from '~api/domain/tags/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';
import { BodyType, Ethnicity, EyeColor, Gender, HairColor, HairLength } from '../enums';
import { ITalentSkill } from '../interfaces';

export class TalentDto {
	@DtoProperty()
	userId: number;

	@DtoProperty()
	name: string;

	@DtoProperty()
	mainOccupTagId: number;

	@DtoProperty()
	secondOccupTagId: number;

	@DtoProperty()
	representative: string;

	@DtoProperty()
	dateOfBirth: string;

	@DtoProperty({ enum: Gender })
	gender: Gender;

	// @DtoProperty()
	// nationalityTagId: number

	@DtoProperty()
	nationality: string;

	@DtoProperty({ enum: Ethnicity })
	ethnicity: Ethnicity;

	@DtoProperty()
	location: string;

	@DtoProperty()
	countryCode: string;

	@DtoProperty()
	experience: number;

	@DtoProperty()
	height: number;

	@DtoProperty()
	weight: number;

	@DtoProperty({ enum: EyeColor })
	eyeColor: EyeColor;

	@DtoProperty()
	waist: number;

	@DtoProperty()
	qualifications?: string;

	@DtoProperty({ enum: BodyType })
	bodyType: BodyType;

	@DtoProperty({ enum: HairColor })
	hairColor: HairColor;

	@DtoProperty({ enum: HairLength })
	hairLength: HairLength;

	@DtoProperty()
	ageFrom: number;

	@DtoProperty()
	ageTo: number;

	@DtoProperty()
	mobileNumber: string;

	@DtoProperty()
	email: string;

	@DtoProperty()
	payPerDay: number;

	@DtoProperty()
	currency: string;

	@DtoProperty()
	description: string;
}

export class TalentPlainDto extends TalentDto {
	@DtoProperty({}, 'exclude')
	skills?: ITalentSkill[];
}

export class TalentAccountDto extends TalentDto {
	@DtoPropertyOptional({ isArray: true, type: Number })
	skillTagIds?: number[];

	@DtoPropertyOptional({ isArray: true, type: TagResponseDto })
	tags?: TagResponseDto[];

	@DtoPropertyOptional({ isArray: true, type: SocialLinkResponseDto })
	socialMedia?: SocialLinkResponseDto[];
}

export class TalentEducationDto {
	@DtoProperty()
	title: string;

	@DtoProperty()
	description: string;
}

export class TalentsListDto {
	@DtoProperty({
		isArray: true,
		type: TalentPlainDto,
	})
	items: TalentPlainDto[];

	@DtoProperty()
	count: number;
}
