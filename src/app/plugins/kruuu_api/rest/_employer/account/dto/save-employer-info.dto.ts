import { IsEmail, IsNumber, IsNumberString, IsString } from 'class-validator';
import { EmployerType, FacilitiesAndServices } from '~api/domain/employer/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class SaveEmployerInfoPayloadDto {
	@DtoProperty()
	@IsString()
	name: string;

	@DtoProperty({ enum: EmployerType })
	type: EmployerType;

	@DtoProperty({ enum: FacilitiesAndServices })
	facilAndServ: FacilitiesAndServices;

	@DtoPropertyOptional()
	@IsString()
	location?: string;

	@DtoPropertyOptional()
	@IsString()
	countryCode?: string;

	@DtoProperty()
	@IsNumber()
	established: number;

	@DtoProperty()
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
}
