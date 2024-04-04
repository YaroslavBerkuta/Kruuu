import { DtoProperty } from '~api/shared';

export class RemoveUserPayloadDto {
	@DtoProperty()
	password: string;
}
