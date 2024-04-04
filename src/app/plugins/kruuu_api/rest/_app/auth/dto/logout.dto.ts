import { IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class LogoutPayloadDto {
	@DtoProperty()
	@IsString()
	refreshToken: string;
}
