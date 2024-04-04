import { Inject, Injectable } from '@nestjs/common';
import { transactions } from 'lisk-sdk';
import { Currency, IWalletsRepository, WALLETS_REPOSITORY } from '~api/domain/wallets/typing';
import { getEnv } from '~api/shared';
import * as numeral from 'numeral';

@Injectable()
export class BlockchainFeeService {
	private minFee: string;

	@Inject(WALLETS_REPOSITORY)
	private readonly walletsRepository: IWalletsRepository;

	onModuleInit() {
		this.minFee = getEnv('MIN_BEDDOWS_FEE');
	}

	public getMinFeeInBeddows() {
		return numeral(this.minFee).value();
	}

	public async getMinFeeInLSK() {
		return transactions.convertBeddowsToLSK(this.minFee);
	}

	public async isUserCanMakeTransaction(userId: number) {
		const wallet = await this.walletsRepository.findOne({
			where: { userId, currency: Currency.KruuuCoin },
		});
		console.log('userId', userId, wallet);
		if (!wallet) return false;
		console.log('wallet', wallet);

		return wallet.balance >= this.getMinFeeInBeddows();
	}
}
