import { IsString } from 'class-validator';
import { TokenPairDto } from '~api/domain/sessions/typing';
import { DtoProperty } from '~api/shared';

export class ResetPasswordPayloadDto {
	@DtoProperty()
	@IsString()
	code: string;

	@DtoProperty()
	@IsString()
	email: string;

	@DtoProperty()
	@IsString()
	password: string;

	@DtoProperty()
	@IsString()
	deviceName?: string;
}

export class ResetPasswordResponseDto extends TokenPairDto {}
