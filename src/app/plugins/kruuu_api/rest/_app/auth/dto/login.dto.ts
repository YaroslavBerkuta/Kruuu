import { IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class LoginPayloadDto {
	@DtoProperty()
	@IsString()
	email: string;

	@DtoProperty()
	@IsString()
	password: string;

	@DtoProperty()
	@IsString()
	deviceName: string;
}
