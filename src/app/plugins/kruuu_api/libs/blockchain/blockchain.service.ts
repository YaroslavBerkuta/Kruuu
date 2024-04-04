import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { apiClient, cryptography, transactions } from 'lisk-sdk';
import { getGenesisPrivateKey } from '~api/config';
import { IUsersRepository, USERS_REPOSITORY } from '~api/domain/users/typing';
import { CORE_API } from '~api/shared';
import {
	AuthAccountJSON,
	IBlockApiService,
	ICreateUserSignedTxPayload,
	IGetTokensBalanceResult,
} from './typing/interfaces';
import { defaultTo } from 'lodash';

import { GENESIS_ACCOUNT_PRIVATE_KEY } from 'app/plugins/kruuu_faucet/config';
import * as numeral from 'numeral';
import { BLOCK_FEE_SERVICE } from './typing';
import { BlockchainFeeService } from './services';
import { NotEnoughKruuuCoinsExeption } from './exeptions';
import * as ldid from '@lisk-did/lisk-decentralized-identifier';

@Injectable()
export class BlockchainApiService implements IBlockApiService {
	@Inject(CORE_API)
	public readonly api: apiClient.APIClient;

	@Inject(USERS_REPOSITORY)
	private readonly usersRepository: IUsersRepository;

	@Inject(BLOCK_FEE_SERVICE)
	private readonly blockFeeService: BlockchainFeeService;

	public async genesisPrivateKey() {
		return getGenesisPrivateKey();
	}

	public async createUserSignedTx(userId: number, payload: ICreateUserSignedTxPayload) {
		try {
			const isUserHasEnoughLSKForTransation = await this.blockFeeService.isUserCanMakeTransaction(
				userId,
			);
			if (!isUserHasEnoughLSKForTransation) throw new NotEnoughKruuuCoinsExeption();

			const privateKey = await this.getUserPrivateKey(userId);
			const address = cryptography.address.getAddressFromPrivateKey(privateKey);
			const listAddress = cryptography.address.getLisk32AddressFromAddress(address);
			const nonce = await this.getAccountNonce(listAddress);
			const signedTx = await this.api.transaction.create(
				{
					module: defaultTo(payload.module, 'freelancing'),
					command: payload.command,
					nonce: String(nonce),
					fee: defaultTo(payload.fee, BigInt(transactions.convertLSKToBeddows('0'))),
					params: payload.params,
				},
				privateKey.toString('hex'),
			);

			const sendResult = await this.api.transaction.send(signedTx);

			return sendResult;
		} catch (e: any) {
			console.log(e);
			throw new BadRequestException(e.message);
		}
	}

	public async getUserPrivateKey(userId: number) {
		const user = await this.usersRepository.findOne({
			where: { id: userId },
			select: ['passphrase12words'],
		});
		if (!user) throw new Error('User not found');
		const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
			user.passphrase12words,
			"m/44'/134'/0'",
		);
		return privateKey;
	}

	public async getUserPublicKey(userId: number): Promise<string> {
		const privateKey = await this.getUserPrivateKey(userId);
		const addres = await cryptography.address.getAddressFromPrivateKey(privateKey);
		const lisk32adress = await cryptography.address.getLisk32AddressFromAddress(addres);
		return lisk32adress;
	}

	public async getLisk32UserAddress(userId: number): Promise<string> {
		const user = await this.usersRepository.findOne({ where: { id: userId } });
		const lisk32 = await cryptography.address.getLisk32AddressFromAddress(
			Buffer.from(user.publicAddress, 'hex'),
		);

		return lisk32;
	}

	public async getUserIdByAddress(address: string): Promise<number> {
		const user = await this.usersRepository.findOne({ where: { publicAddress: address } });
		return user?.id;
	}

	public async faucetUserBalance(userId: number, amount: string, index = 0) {
		try {
			const lisk32address = await this.getLisk32UserAddress(userId);
			const genesisPrivateKey = GENESIS_ACCOUNT_PRIVATE_KEY;
			const genesisAddress = cryptography.address.getAddressFromPrivateKey(
				Buffer.from(genesisPrivateKey, 'hex'),
			);
			const genesisLisk32Address = cryptography.address.getLisk32AddressFromAddress(genesisAddress);
			const nonce = await this.getAccountNonce(genesisLisk32Address);

			const nodeInfo = await this.api.invoke('system_getNodeInfo');

			const transaction = await this.api.transaction.create(
				{
					module: 'token',
					command: 'transfer',
					fee: transactions.convertLSKToBeddows('1'),
					nonce: String(nonce + index),
					params: {
						tokenID: `${nodeInfo.chainID}00000000`,
						amount: BigInt(transactions.convertLSKToBeddows(amount)),
						recipientAddress: lisk32address,
						data: 'KRU Devnet Faucet',
					},
				},
				GENESIS_ACCOUNT_PRIVATE_KEY,
			);

			await this.api.transaction.send(transaction);
		} catch (e) {
			console.log('Faucet error', e);
		}
	}

	public async hasTokens(tokens: string, userId: number) {
		const lisk32address = await this.getLisk32UserAddress(userId);
		if (!lisk32address) return false;
		const beddows = numeral(transactions.convertLSKToBeddows(tokens)).value();

		const nodeInfo = await this.api.invoke('system_getNodeInfo');
		const accountToken: IGetTokensBalanceResult = await this.api.invoke('token_getBalance', {
			address: lisk32address,
			tokenID: `${nodeInfo.chainID}00000000`,
		});

		const existBeddos = numeral(accountToken.availableBalance).value();

		return existBeddos >= beddows;
	}

	public async getAccountNonce(lisk32: string) {
		try {
			const accountAuth: AuthAccountJSON = await this.api.invoke('auth_getAuthAccount', {
				address: lisk32,
			});

			return Number(accountAuth.nonce);
		} catch (e) {
			return 0;
		}
	}

	public async initDIDdocument(userId: number) {
		try {
			const lisk32address = await this.getLisk32UserAddress(userId);
			const privateKey = await this.getUserPrivateKey(userId);

			const nonce = await this.getAccountNonce(lisk32address);
			console.log('nonce', nonce);

			const nodeInfo = await this.api.invoke('system_getNodeInfo');
			console.log('nodeInfo', nodeInfo);

			const transaction = await this.api.transaction.create(
				{
					module: 'token',
					command: 'transfer',
					fee: '0',
					nonce: String(nonce),
					params: {
						tokenID: `${nodeInfo.chainID}00000000`,
						amount: '0',
						recipientAddress: lisk32address,
						data: 'some data',
					},
				},
				privateKey.toString('hex'),
			);

			await this.api.transaction.send(transaction);
		} catch (e) {
			console.log('eror', e);
		}
	}

	public async getUserDID(userId: number): Promise<string> {
		const privateKey = await this.getUserPrivateKey(userId);
		const publicKey = cryptography.ed.getPublicKeyFromPrivateKey(privateKey);

		return ldid.getAddressDIDFromPublicKey('kruuu', publicKey);
	}
}
