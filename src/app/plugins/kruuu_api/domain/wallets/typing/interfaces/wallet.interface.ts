import { IUser } from '~api/domain/users/typing';
import { Currency, WalletActionType } from '../enums';

export interface IWallet {
	id: number;
	currency: Currency;
	name?: string;
	factor: number;
	userId: number;
	balance: string;
	createdAt: string;
	updatedAt: string;

	actions?: IWalletAction[];
	user?: IUser;
}

export interface IWalletAction {
	id: number;
	walletId: number;
	value: number;
	type: WalletActionType;
	reason: string;
	balanceSnapshoot: number;
	data?: any;
	createdAt: string;
	wallet?: IWallet;
}
