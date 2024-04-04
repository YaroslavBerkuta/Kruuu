import { IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class RequestRecoveryOTPPayloadDto {
	@DtoProperty()
	@IsString()
	email: string;
}
