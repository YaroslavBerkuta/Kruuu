import { DtoProperty } from '~api/shared';

export class PaymentMethodDto {
	@DtoProperty()
	paymentMethod: string;

	@DtoProperty()
	paymentName: string;

	@DtoProperty()
	paymentImage: string;

	@DtoProperty()
	totalFee: string;
}
