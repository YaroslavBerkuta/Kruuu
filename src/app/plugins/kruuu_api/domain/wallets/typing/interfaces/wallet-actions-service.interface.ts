import { Currency, WalletActionType } from '../enums';

export interface IWalletActionsService {
	add(payload: IAddWalletActionPayload): Promise<void>;
	getChangesByDay(payload: IGetChangesByDayParams): Promise<number>;
}

export interface IAddWalletActionPayload {
	walletId: number;
	type: WalletActionType;
	reason: string;
	value: number;
	balanceSnapshoot: number;
	data?: any;
}

export interface IGetChangesByDayParams {
	currency: Currency;
	userId: number;
	startAt: Date;
}
