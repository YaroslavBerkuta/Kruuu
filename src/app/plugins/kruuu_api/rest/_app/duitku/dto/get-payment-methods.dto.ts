import { IsNumberString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class GetPaymentMethodsParamsDto {
	@DtoProperty()
	@IsNumberString()
	amount: number;
}
