import { PaymentMethod } from '~api/domain/payment/typing';
import { Currency } from '~api/domain/wallets/typing';
import { DtoProperty } from '~api/shared';

export class IncreaseBalanceDto {
	@DtoProperty({ type: String, enum: PaymentMethod })
	paymentMethod: PaymentMethod;

	@DtoProperty({ type: String, enum: Currency })
	currency: Currency;

	@DtoProperty()
	amount: number;
}

export class IncreaseCreaditDto {
	@DtoProperty()
	amount: number;

	@DtoProperty()
	fromCurrency: Currency;
}
