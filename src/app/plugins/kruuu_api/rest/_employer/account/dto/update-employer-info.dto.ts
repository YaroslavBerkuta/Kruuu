import { IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';
import { EmployerType, FacilitiesAndServices } from '~api/domain/employer/typing';
import { DtoPropertyOptional } from '~api/shared';

export class UpdateEmployerInfoPayloadDto {
	@DtoPropertyOptional()
	@IsString()
	name: string;

	@DtoPropertyOptional({ enum: EmployerType })
	type: EmployerType;

	@DtoPropertyOptional({ enum: FacilitiesAndServices })
	facilAndServ: FacilitiesAndServices;

	@DtoPropertyOptional()
	@IsString()
	location?: string;

	@DtoPropertyOptional()
	@IsString()
	countryCode?: string;

	@DtoPropertyOptional()
	@IsNumber()
	established: number;

	@DtoPropertyOptional()
	@IsString()
	industry: string;

	@DtoPropertyOptional()
	@IsString()
	description?: string;

	@DtoPropertyOptional()
	@IsNumberString()
	mobileNumber?: string;

	@DtoPropertyOptional()
	@IsEmail()
	email?: string;

	@DtoPropertyOptional()
	@IsString()
	siupp?: string;

	@DtoPropertyOptional()
	@IsString()
	owner?: string;

	@DtoPropertyOptional()
	@IsString()
	npwp?: string;

	@DtoPropertyOptional()
	@IsString()
	websiteName?: string;

	@DtoPropertyOptional()
	@IsString()
	anotherLink?: string;
}
