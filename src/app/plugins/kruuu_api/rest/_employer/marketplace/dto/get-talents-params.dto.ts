import { IsNumberString, IsString } from 'class-validator';

import {
	BodyType,
	Ethnicity,
	EyeColor,
	Gender,
	HairColor,
	HairLength,
} from '~api/domain/talents/typing';
import { DtoPropertyOptional } from '~api/shared';

export class GetTalentsParamsDto {
	@DtoPropertyOptional()
	occupationTagId?: number;

	@DtoPropertyOptional({ enum: Gender })
	gender?: Gender;

	@DtoPropertyOptional()
	@IsNumberString()
	experienceFrom?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	experienceTo?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	ageFrom?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	ageTo?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	heightFrom?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	heightTo?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	weightFrom?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	weightTo?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	waistFrom?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	waistTo?: number;

	@DtoPropertyOptional({ enum: EyeColor })
	eyeColor?: EyeColor;

	@DtoPropertyOptional({ enum: BodyType })
	bodyType?: BodyType;

	@DtoPropertyOptional({ enum: HairColor })
	hairColor?: HairColor;

	@DtoPropertyOptional({ enum: HairLength })
	hairLength?: HairLength;

	@DtoPropertyOptional()
	@IsString()
	nationality?: string;

	@DtoPropertyOptional({ enum: Ethnicity })
	ethnicity?: Ethnicity;

	@DtoPropertyOptional()
	@IsString()
	location?: string;

	@DtoPropertyOptional()
	@IsNumberString({}, { each: true })
	skillTagIds?: number[];
}
