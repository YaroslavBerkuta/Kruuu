import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import {
	CreateUserPayload,
	IUser,
	IUsersService,
	IUsersSocialsRepository,
	UpdateUserPayload,
	UserRole,
	USERS_REPOSITORY,
	USERS_SOCIALS_REPOSITORY,
	UserSocialType,
} from '../typing';
import { IUsersRepository } from '../typing';
import { UsersPasswordsService } from './users-passwords.service';
import { Currency, IWalletService, WALLETS_SERVICE } from '~api/domain/wallets/typing';
import { Mnemonic } from '@liskhq/lisk-passphrase';
import { cryptography } from 'lisk-sdk';
import { BLOCK_API_SERVICE, IBlockApiService } from '~api/libs/blockchain/typing';

@Injectable()
export class UsersService implements IUsersService {
	@Inject(USERS_REPOSITORY) private readonly usersRepository: IUsersRepository;

	@Inject(USERS_SOCIALS_REPOSITORY)
	private readonly usersSocialRepository: IUsersSocialsRepository;

	@Inject(WALLETS_SERVICE)
	private walletsService: IWalletService;

	@Inject(BLOCK_API_SERVICE)
	private blockApiService: IBlockApiService;

	constructor(private readonly usersPasswordsService: UsersPasswordsService) {}

	public async create(payload: CreateUserPayload) {
		const passwordSalt = this.usersPasswordsService.createUserSalt();

		const password = await this.usersPasswordsService.hashPassword(payload.password, passwordSalt);

		const passphrase12words = this.generate12wordsPass();
		const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
			passphrase12words,
			"m/44'/134'/0'",
		);
		const publicAddress = await cryptography.address.getAddressFromPrivateKey(privateKey);

		const user = await this.usersRepository.save({
			...payload,
			passphrase12words,
			password,
			passwordSalt,
			publicAddress: publicAddress.toString('hex'),
		});

		try {
			await this.walletsService.store({
				currency: Currency.KruuuCoin,
				userId: user.id,
				initBalance: 0,
				name: 'Kruuu coins',
			});
			await this.walletsService.store({
				currency: Currency.Credit,
				userId: user.id,
				initBalance: 0,
				name: 'Credits',
			});
			await this.walletsService.store({
				currency: Currency.IDR,
				userId: user.id,
				initBalance: 0,
				name: 'IDR',
			});
		} catch (e) {}

		await this.blockApiService.faucetUserBalance(user.id, '1000');
		await this.blockApiService.initDIDdocument(user.id);

		return user.id;
	}

	public async changeFillProgress(
		userId: number,
		fieldsCount: number,
		completeFieldsCount: number,
	) {
		const progress: number = (completeFieldsCount / fieldsCount) * 100;
		await this.usersRepository.update(userId, { progressFill: progress });
	}

	public async update(_id: number, _payload: UpdateUserPayload) {
		//TODO: implement update user info
	}

	public async delete(id: number) {
		//TODO: implement delete user (delete from db or only set deleted status)
		await this.usersRepository.delete({ id });
	}

	public async getOneByEmail(email: string) {
		return this.usersRepository.findOneBy({ email });
	}

	public async getOneBy(where: FindOptionsWhere<IUser> | FindOptionsWhere<IUser>[]) {
		return this.usersRepository.findOneBy(where);
	}

	public async compareUserPassword(userId: number, password: string) {
		return await this.usersPasswordsService.compareUserPasswords(userId, password);
	}

	public async changeUserPassword(userId: number, newPassword: string) {
		return await this.usersPasswordsService.changeUserPassword(userId, newPassword);
	}

	public async getSocialUser(
		id: string,
		type: UserSocialType,
		userData?: { email: string; name?: string; role?: UserRole },
	) {
		const existSocialRecord = await this.usersSocialRepository.findOne({
			where: { value: id, type },
		});

		let userId: number;

		if (!existSocialRecord) {
			if (!userData) throw new NotFoundException();

			const existUser = await this.usersRepository.findOne({
				where: { email: userData.email },
			});
			if (existUser) userId = existUser.id;
			else
				userId = await this.create({
					email: userData.email,
					name: userData.name,
					role: userData.role,
					password: Math.random().toFixed(3),
				});

			await this.usersSocialRepository.insert({
				type,
				value: id,
				userId,
			});
		} else userId = existSocialRecord.userId;

		return this.usersRepository.findOne({ where: { id: userId } });
	}

	private generate12wordsPass() {
		return Mnemonic.generateMnemonic();
	}

	public async getUserByPublicAddress(publicAddress: string): Promise<IUser> {
		return this.usersRepository.findOne({ where: { publicAddress } });
	}
}

/*const accountToken: UserStoreData = await client.invoke('token_getBalance', {
	address: cryptography.address.getLisk32AddressFromAddress(Buffer.from(address, 'hex')),
	tokenID: KRU_TOKEN_ID.toString('hex'),
});*/
