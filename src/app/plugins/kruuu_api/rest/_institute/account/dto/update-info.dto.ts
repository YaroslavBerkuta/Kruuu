import { DtoPropertyOptional } from '~api/shared';

export class UpdateInfoDto {
	@DtoPropertyOptional()
	name?: string;

	@DtoPropertyOptional()
	establish?: string;

	@DtoPropertyOptional()
	address?: string;

	@DtoPropertyOptional()
	descriptions?: string;

	@DtoPropertyOptional()
	email?: string;

	@DtoPropertyOptional()
	mobileNumber?: string;
}
