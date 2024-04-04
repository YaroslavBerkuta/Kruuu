import { Currency } from '~api/domain/wallets/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class ResidenceDto {
	@DtoProperty()
	nationality: string;

	@DtoProperty()
	residence: string;
}

export class AppearanceDto {
	@DtoProperty()
	bodyType: string;

	@DtoProperty()
	height: string;

	@DtoProperty()
	ethnic: string;

	@DtoProperty()
	eyeColor: string;

	@DtoProperty()
	hairLength: string;

	@DtoProperty()
	hairColor: string;
}

export class MeasurementDto {
	@DtoProperty()
	top: string;

	@DtoProperty()
	trousers: string;

	@DtoProperty()
	shoes: string;
}

export class JobDto {
	@DtoProperty()
	projectId: number;

	@DtoProperty()
	title: string;

	@DtoProperty()
	industry: number;

	@DtoPropertyOptional()
	type?: number;

	@DtoProperty()
	job: number;

	@DtoProperty()
	peopleNeeded: string;

	@DtoProperty()
	experience: string;

	@DtoProperty()
	startingDate: string;

	@DtoProperty()
	duration: string;

	@DtoProperty()
	location: string;

	@DtoProperty()
	description: string;

	@DtoProperty()
	payment: string;

	@DtoProperty({ type: String, enum: Currency, default: Currency.USD })
	currency: Currency;

	@DtoProperty({ type: Number, isArray: true })
	skills: number[];

	@DtoPropertyOptional()
	uniqueKey: string;

	@DtoProperty()
	appearance: AppearanceDto;

	@DtoProperty()
	measurement: MeasurementDto;

	@DtoProperty()
	residence: ResidenceDto;
}
