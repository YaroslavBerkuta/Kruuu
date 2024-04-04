import { Currency } from '~api/domain/wallets/typing';
import { DtoPropertyOptional } from '~api/shared';

export class UpdateResidenceDto {
	@DtoPropertyOptional()
	nationality?: string;

	@DtoPropertyOptional()
	residence?: string;
}

export class AppearanceDto {
	@DtoPropertyOptional()
	bodyType?: string;

	@DtoPropertyOptional()
	height?: string;

	@DtoPropertyOptional()
	ethnic?: string;

	@DtoPropertyOptional()
	eyeColor?: string;

	@DtoPropertyOptional()
	hairLength?: string;

	@DtoPropertyOptional()
	hairColor?: string;
}

export class UpdateMeasurementDto {
	@DtoPropertyOptional()
	top?: string;

	@DtoPropertyOptional()
	trousers?: string;

	@DtoPropertyOptional()
	shoes?: string;
}

export class UpdateJobDto {
	@DtoPropertyOptional()
	title?: string;

	@DtoPropertyOptional()
	industry?: number;

	@DtoPropertyOptional()
	type?: number;

	@DtoPropertyOptional()
	job?: number;

	@DtoPropertyOptional()
	peopleNeeded?: string;

	@DtoPropertyOptional()
	experience?: string;

	@DtoPropertyOptional()
	startingDate?: string;

	@DtoPropertyOptional()
	duration?: string;

	@DtoPropertyOptional()
	location?: string;

	@DtoPropertyOptional()
	description?: string;

	@DtoPropertyOptional()
	payment?: string;

	@DtoPropertyOptional({ type: String, enum: Currency, default: Currency.USD })
	currency?: Currency;

	@DtoPropertyOptional({ type: Number, isArray: true })
	skills?: number[];

	@DtoPropertyOptional()
	appearance?: AppearanceDto;

	@DtoPropertyOptional()
	measurement?: UpdateMeasurementDto;

	@DtoPropertyOptional()
	residence?: UpdateResidenceDto;
}
