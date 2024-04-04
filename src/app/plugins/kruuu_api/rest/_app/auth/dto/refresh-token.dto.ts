import { IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class RefreshTokenDto {
	@DtoProperty()
	@IsString()
	refreshToken: string;
}
