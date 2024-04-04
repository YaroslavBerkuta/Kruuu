import { IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class RequestOTPPayloadDto {
	@DtoProperty()
	@IsString()
	email: string;
}
