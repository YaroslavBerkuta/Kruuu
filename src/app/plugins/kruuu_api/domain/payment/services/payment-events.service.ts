import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IWalletService, WALLETS_SERVICE } from '~api/domain/wallets/typing';
import { Events, IEventsPayloads, WalletReason } from '~api/shared';

@Injectable()
export class PaymentEventService {
	@Inject(WALLETS_SERVICE) private readonly walletService: IWalletService;

	@OnEvent(Events.IncreaseWalletBalance)
	public async walletIncreaseBalance({
		userId,
		value,
		currency,
	}: IEventsPayloads[Events.IncreaseWalletBalance]) {
		await this.walletService.increaseBalance({
			userId,
			value,
			currency,
			reason: WalletReason.BuyingRupiah,
		});
	}
}
