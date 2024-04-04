import { DtoProperty } from '~api/shared';

export class SaveInfoDto {
	@DtoProperty()
	name: string;

	@DtoProperty()
	establish: string;

	@DtoProperty()
	address: string;

	@DtoProperty()
	descriptions: string;

	@DtoProperty()
	email: string;

	@DtoProperty()
	mobileNumber: string;
}
