import { IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class ConfirmOTPPayloadDto {
	@DtoProperty()
	@IsString()
	code: string;

	@DtoProperty()
	@IsString()
	email: string;
}
