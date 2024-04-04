import { TagResponseDto } from '~api/domain/tags/typing';
import {
	Gender,
	Ethnicity,
	EyeColor,
	BodyType,
	HairColor,
	HairLength,
	ITalentSkill,
} from '~api/domain/talents/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class TalentInListPlainDto {
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

	@DtoProperty({}, 'exclude')
	dateOfBirth: string;

	@DtoProperty({ enum: Gender }, 'exclude')
	gender: Gender;

	@DtoProperty({}, 'exclude')
	nationality: string;

	@DtoProperty({ enum: Ethnicity }, 'exclude')
	ethnicity: Ethnicity;

	@DtoProperty({}, 'exclude')
	location: string;

	@DtoProperty({}, 'exclude')
	countryCode: string;

	@DtoProperty({}, 'exclude')
	experience: number;

	@DtoProperty({}, 'exclude')
	height: number;

	@DtoProperty({}, 'exclude')
	weight: number;

	@DtoProperty({ enum: EyeColor }, 'exclude')
	eyeColor: EyeColor;

	@DtoProperty({}, 'exclude')
	waist: number;

	@DtoProperty({ enum: BodyType }, 'exclude')
	bodyType: BodyType;

	@DtoProperty({ enum: HairColor }, 'exclude')
	hairColor: HairColor;

	@DtoProperty({ enum: HairLength }, 'exclude')
	hairLength: HairLength;

	@DtoProperty({}, 'exclude')
	ageFrom: number;

	@DtoProperty({}, 'exclude')
	ageTo: number;

	@DtoProperty({}, 'exclude')
	mobileNumber: string;

	@DtoProperty({}, 'exclude')
	email: string;

	@DtoProperty({}, 'exclude')
	payPerDay: number;

	@DtoProperty({}, 'exclude')
	currency: string;

	@DtoProperty()
	description: string;

	@DtoPropertyOptional({ isArray: true, type: TagResponseDto })
	tags?: TagResponseDto[];

	@DtoProperty({}, 'exclude')
	skills?: ITalentSkill[];
}

export class TalentInListDto {
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
	description: string;

	@DtoPropertyOptional({ isArray: true, type: TagResponseDto })
	tags?: TagResponseDto[];
}

export class GetTalentsListResponseDto {
	@DtoProperty({
		isArray: true,
		type: TalentInListDto,
	})
	items: TalentInListDto[];

	@DtoProperty()
	count: number;
}
