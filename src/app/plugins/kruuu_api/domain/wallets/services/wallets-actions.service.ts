import { Inject, Injectable } from '@nestjs/common';
import { WalletActionType } from '../typing';
import { WALLETS_ACTIONS_REPOSITORY } from '../typing/consts';
import {
	IAddWalletActionPayload,
	IGetChangesByDayParams,
	IWalletActionsService,
	IWalletsActionsRepository,
} from '../typing/interfaces';
import { dateToSqlFormat } from '~api/shared';

@Injectable()
export class WalletsActionsService implements IWalletActionsService {
	@Inject(WALLETS_ACTIONS_REPOSITORY)
	private readonly walletsActionsRepository: IWalletsActionsRepository;

	public async add(payload: IAddWalletActionPayload) {
		await this.walletsActionsRepository.insert({
			walletId: payload.walletId,
			type: payload.type,
			reason: payload.reason,
			data: payload.data,
			balanceSnapshoot: payload.balanceSnapshoot,
			value: payload.value,
		});
	}

	public async getChangesByDay(payload: IGetChangesByDayParams) {
		const actions = await this.walletsActionsRepository
			.createQueryBuilder('it')
			.leftJoin('it.wallet', 'wallet')
			.where('wallet.currency = :currency', { currency: payload.currency })
			.andWhere('wallet.userId = :userId', { userId: payload.userId })
			.andWhere('it.createdAt >= :startAt', { startAt: dateToSqlFormat(payload.startAt) })
			.getMany();

		let result = 0;

		actions.map(it => {
			if (it.type === WalletActionType.Add) {
				result = Number(result) + Number(it.value);
			} else {
				result = Number(result) - Number(it.value);
			}
		});

		return result;
	}
}
