import { Type } from 'class-transformer';

import { DtoProperty, DtoPropertyOptional } from '~api/shared';
import { Currency, WalletActionType } from '../enums';
import { IUser } from '~api/domain/users/typing';

export class WalletActionDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	walletId: number;

	@DtoProperty()
	type: WalletActionType;

	@DtoProperty()
	value: number;

	@DtoProperty()
	balanceSnapshoot: number;

	@DtoProperty()
	reason: string;

	@DtoProperty()
	data?: any;

	@DtoProperty()
	createdAt: string;
}

export class TransactionsHistorySentDto extends WalletActionDto {
	@DtoProperty()
	dataDetails: IUser;
}
export class WalletDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	currency: Currency;

	@DtoProperty()
	userId: number;

	@DtoProperty()
	balance: number;

	@DtoProperty()
	createdAt: string;

	@DtoProperty()
	updatedAt: string;

	@Type(() => WalletActionDto)
	@DtoPropertyOptional({ isArray: true, type: WalletActionDto })
	actions?: WalletActionDto[];
}
