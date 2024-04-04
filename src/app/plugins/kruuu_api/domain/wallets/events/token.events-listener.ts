import { DecodedEventJSON } from '@liskhq/lisk-api-client/dist-node/types';
import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { BlockListener } from '~api/shared';
import {
	Currency,
	IWalletService,
	IWalletsRepository,
	WALLETS_REPOSITORY,
	WALLETS_SERVICE,
} from '../typing';
import { BLOCK_API_SERVICE, IBlockApiService } from '~api/libs/blockchain/typing';
import { cryptography } from 'lisk-sdk';

interface UserStoreData {
	availableBalance: string;
	lockedBalances: {
		module: string;
		amount: bigint;
	}[];
}

@Injectable()
export class TokensEventsListener extends BlockListener {
	protected listenModule = 'token';

	@Inject(WALLETS_REPOSITORY)
	private readonly walletsRepository: IWalletsRepository;

	@Inject(BLOCK_API_SERVICE)
	private readonly blockApiService: IBlockApiService;

	@Inject(WALLETS_SERVICE)
	private readonly walletsService: IWalletService;

	protected async onEvent(eventData: DecodedEventJSON) {
		try {
			console.log('EventData', eventData.name);
			if (eventData.name === 'transfer') await this.reloadTokenWallets(eventData);
			if (eventData.name === 'burn') await this.reloadTokenWallets(eventData);
		} catch (e) {
			console.log(e);
		}
	}

	protected async reloadTokenWallets(eventData: DecodedEventJSON) {
		const { data } = eventData;
		if (data.senderAddress) await this.reloadTokenWallet(String(data.senderAddress));
		if (data.recipientAddress) await this.reloadTokenWallet(String(data.recipientAddress));
	}

	protected async reloadTokenWallet(lisk32address: string) {
		const address = cryptography.address.getAddressFromLisk32Address(lisk32address);
		const userId = await this.blockApiService.getUserIdByAddress(address.toString('hex'));

		if (!userId) return;

		let wallet = await this.walletsRepository.findOne({
			where: {
				currency: Currency.KruuuCoin,
				userId,
			},
		});
		if (!wallet) {
			wallet = await this.walletsService.store({
				userId,
				currency: Currency.KruuuCoin,
				initBalance: 0,
				name: 'KRUUU Tokens',
			});
		}

		const nodeInfo = await this.coreApi.invoke('system_getNodeInfo');
		const accountToken: UserStoreData = await this.coreApi.invoke('token_getBalance', {
			address: lisk32address,
			tokenID: `${nodeInfo.chainID}00000000`,
		});
		await this.walletsRepository.update(wallet.id, {
			balance: accountToken.availableBalance,
		});
	}
}
