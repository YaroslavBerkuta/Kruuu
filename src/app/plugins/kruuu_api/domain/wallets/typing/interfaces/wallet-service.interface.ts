import { Currency, WalletActionReason, WalletActionType } from '../enums';
import { IWallet } from './wallet.interface';

export interface IWalletService {
	store(payload: IStoreWalletPayload): Promise<IWallet>;
	increaseBalance(payload: IIncreaseWalletBalancePayload): Promise<void>;
	decreaseBalance(payload: IIncreaseWalletBalancePayload): Promise<void>;
}

export interface IStoreWalletPayload {
	currency: Currency;
	userId: number;
	initBalance: number;
	name: string;
}

export interface IIncreaseWalletBalancePayload {
	currency?: Currency;
	userId?: number;

	walletId?: number;
	reason: string;
	value: number;
	data?: any;
}

export interface IGetWalletSummaryParams {
	userId?: number;
	currency?: Currency;
	walletId?: number;

	startDate?: string;
	endDate?: string;

	type: WalletActionType;

	execludesReasons?: Array<WalletActionReason>;
	includesReasons?: Array<WalletActionReason>;
}
