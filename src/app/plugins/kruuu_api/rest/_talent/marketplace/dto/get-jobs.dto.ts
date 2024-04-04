import { IsNumberString, IsString } from 'class-validator';
import { Currency } from '~api/domain/wallets/typing';

import { DtoPropertyOptional } from '~api/shared';

export class GetJobsParamsDto {
	@DtoPropertyOptional()
	@IsNumberString()
	employerId?: number;

	@DtoPropertyOptional({ enum: Currency })
	currency?: Currency;

	@DtoPropertyOptional()
	@IsNumberString()
	feeFrom?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	feeTo?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	industryTagId?: number;

	@DtoPropertyOptional()
	@IsNumberString()
	typeTagId?: number;

	@DtoPropertyOptional()
	@IsString({ each: true })
	experience?: string[];

	@DtoPropertyOptional()
	@IsString({ each: true })
	duration?: string[];

	@DtoPropertyOptional()
	@IsString()
	location?: string;
}
