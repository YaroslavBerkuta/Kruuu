import { Inject, Injectable } from '@nestjs/common';

import _ from 'lodash';
import { isNumber } from 'lodash';
import { WalletNotExistExeption } from '../exeptions';
import { WALLETS_ACTIONS_SERVICE, WALLETS_REPOSITORY } from '../typing/consts';
import { Currency, WalletActionType } from '../typing/enums';
import {
	IIncreaseWalletBalancePayload,
	IStoreWalletPayload,
	IWallet,
	IWalletActionsService,
	IWalletService,
	IWalletsRepository,
} from '../typing/interfaces';

@Injectable()
export class WalletsService implements IWalletService {
	@Inject(WALLETS_REPOSITORY)
	private readonly walletsRepository: IWalletsRepository;

	@Inject(WALLETS_ACTIONS_SERVICE)
	private readonly walletsActionsService: IWalletActionsService;

	public async store(payload: IStoreWalletPayload): Promise<IWallet> {
		const existWallet = await this.getUserWalletByCurrency(payload.currency, payload.userId);
		if (existWallet) return existWallet;

		const wallet = await this.walletsRepository.save({
			balance: '0',
			userId: payload.userId,
			currency: payload.currency,
			name: payload.name,
			factor: 1,
		});

		return wallet;
	}

	public async increaseBalance(payload: IIncreaseWalletBalancePayload): Promise<void> {
		try {
			if (payload.value <= 0) return;

			const wallet = await this.getWalletByPayload(payload);
			if (!wallet) throw new WalletNotExistExeption();

			const [newBalance, value] = this.calcInceaseBalance(
				Number(wallet.balance),
				payload.value,
				wallet.factor,
			);

			if (!isNumber(newBalance)) return;

			await this.walletsRepository.update(wallet.id, { balance: String(newBalance) });

			await this.walletsActionsService.add({
				walletId: wallet.id,
				value: value,
				type: WalletActionType.Add,
				reason: payload.reason,
				balanceSnapshoot: newBalance,
			});
		} catch (e) {}
	}
	public async decreaseBalance(payload: IIncreaseWalletBalancePayload): Promise<void> {
		try {
			if (payload.value <= 0) return;

			const wallet = await this.getWalletByPayload(payload);
			if (!wallet) throw new WalletNotExistExeption();

			let value = Number(payload.value);
			const newBalance = Number(Number(Math.max(Number(wallet.balance) - value, 0)).toFixed(2));

			if (!isNumber(newBalance)) return;

			await this.walletsRepository.update(wallet.id, { balance: String(newBalance) });

			await this.walletsActionsService.add({
				walletId: wallet.id,
				value: value,
				type: WalletActionType.Minus,
				reason: payload.reason,
				balanceSnapshoot: newBalance,
			});
		} catch (e) {
			console.log('error take money');
		}
	}

	private getWalletById(id: number) {
		return this.walletsRepository.findOne({ where: { id } });
	}

	private getUserWalletByCurrency(currency: Currency, userId: number) {
		return this.walletsRepository.findOne({
			where: {
				userId,
				currency,
			},
		});
	}

	private async getWalletByPayload(payload: {
		walletId?: number;
		userId?: number;
		currency?: Currency;
	}) {
		if (payload.walletId) {
			return await this.getWalletById(payload.walletId);
		} else {
			return await this.getUserWalletByCurrency(payload.currency, payload.userId);
		}
	}

	private calcInceaseBalance(balance: number, value: number, factor = 1) {
		const realValue = Number(value) * Number(factor);
		return [Number(Number(Math.max(Number(balance) + realValue, 0)).toFixed(2)), realValue];
	}
}
