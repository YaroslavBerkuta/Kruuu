import { IsDateString, IsEmail, IsEnum, IsNumber, IsNumberString, IsString } from 'class-validator';
import {
	BodyType,
	Ethnicity,
	EyeColor,
	Gender,
	HairColor,
	HairLength,
} from '~api/domain/talents/typing';
import { DtoPropertyOptional } from '~api/shared';

export class UpdateTalentInfoPayloadDto {
	@DtoPropertyOptional()
	@IsString()
	name: string;

	@DtoPropertyOptional()
	@IsNumber()
	mainOccupTagId: number;

	@DtoPropertyOptional()
	@IsNumber()
	secondOccupTagId?: number;

	@DtoPropertyOptional()
	@IsString()
	representative?: string;

	@DtoPropertyOptional()
	@IsDateString()
	dateOfBirth?: string;

	@DtoPropertyOptional({ enum: Gender })
	gender?: Gender;

	@DtoPropertyOptional()
	@IsString()
	nationality?: string;

	@DtoPropertyOptional({ enum: Ethnicity })
	ethnicity?: Ethnicity;

	@DtoPropertyOptional()
	@IsString()
	location?: string;

	@DtoPropertyOptional()
	@IsString()
	countryCode?: string;

	@DtoPropertyOptional()
	@IsNumber()
	experience?: number;

	@DtoPropertyOptional()
	@IsNumber()
	height?: number;

	@DtoPropertyOptional()
	@IsNumber()
	weight?: number;

	@DtoPropertyOptional({ enum: EyeColor })
	@IsEnum(EyeColor)
	eyeColor?: EyeColor;

	@DtoPropertyOptional()
	@IsNumber()
	waist?: number;

	@DtoPropertyOptional({ enum: BodyType })
	bodyType?: BodyType;

	@DtoPropertyOptional({ enum: HairColor })
	hairColor?: HairColor;

	@DtoPropertyOptional({ enum: HairLength })
	hairLength?: HairLength;

	@DtoPropertyOptional()
	@IsNumber()
	ageFrom?: number;

	@DtoPropertyOptional()
	@IsNumber()
	ageTo?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	mobileNumber?: string;

	@DtoPropertyOptional()
	@IsEmail()
	email?: string;

	@DtoPropertyOptional()
	@IsNumber()
	payPerDay?: number;

	@DtoPropertyOptional()
	@IsString()
	currency?: string;

	@DtoPropertyOptional()
	@IsString()
	description?: string;

	@DtoPropertyOptional()
	qualifications?: string;
}
