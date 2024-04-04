import { IsNumberString, IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class CreateTransactionPayloadDto {
	@DtoProperty()
	@IsNumberString()
	amount: number;

	@DtoProperty()
	@IsString()
	paymentMethod: string;
}
