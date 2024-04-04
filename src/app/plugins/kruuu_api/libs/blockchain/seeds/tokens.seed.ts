import { Inject, Injectable } from '@nestjs/common';
import { cryptography } from 'lisk-sdk';
import { IUsersRepository, USERS_REPOSITORY } from '~api/domain/users/typing';
import { BLOCK_API_SERVICE, IBlockApiService } from '~api/libs/blockchain/typing';
import { Seeder } from '~api/shared';

@Injectable()
export class TokensSeed extends Seeder {
	@Inject(USERS_REPOSITORY)
	private readonly usersRepository: IUsersRepository;

	@Inject(BLOCK_API_SERVICE)
	private readonly blockchainApiService: IBlockApiService;

	protected name = 'Wallets tokens';

	protected async seed() {
		const users = await this.usersRepository.find({
			select: ['id', 'passphrase12words', 'publicAddress'],
		});

		for await (const [index, user] of users.entries()) {
			if (!user.publicAddress) {
				if (user.id !== 999) return;
				const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
					user.passphrase12words,
					"m/44'/134'/0'",
				);
				const address = await cryptography.address.getAddressFromPrivateKey(privateKey);
				await this.usersRepository.update(
					{ id: user.id },
					{ publicAddress: address.toString('hex') },
				);
			}

			await this.blockchainApiService.faucetUserBalance(user.id, '100', index);
		}
	}
}
