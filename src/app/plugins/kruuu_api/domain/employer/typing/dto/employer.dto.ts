import { SocialLinkResponseDto } from '~api/domain/social/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';
import { EmployerType, FacilitiesAndServices } from '../enums';

export class EmployerDto {
	@DtoProperty()
	userId: number;

	@DtoProperty()
	name: string;

	@DtoProperty({ enum: EmployerType })
	type: EmployerType;

	@DtoProperty({ enum: FacilitiesAndServices })
	facilAndServ: FacilitiesAndServices;

	@DtoProperty()
	location: string;

	@DtoProperty()
	countryCode: string;

	@DtoProperty()
	established: number;

	@DtoProperty()
	industry: string;

	@DtoProperty()
	description: string;

	@DtoProperty()
	mobileNumber: string;

	@DtoProperty()
	email: string;

	@DtoProperty()
	siupp: string;

	@DtoProperty()
	owner: string;

	@DtoProperty()
	npwp: string;

	@DtoProperty()
	websiteName: string;

	@DtoProperty()
	anotherLink: string;
}

export class EmployerAccountDto extends EmployerDto {
	@DtoPropertyOptional({ isArray: true, type: SocialLinkResponseDto })
	socialMedia?: SocialLinkResponseDto[];
}
