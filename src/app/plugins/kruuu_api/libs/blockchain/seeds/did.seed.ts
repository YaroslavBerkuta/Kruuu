import { Inject, Injectable } from '@nestjs/common';
import {
	BLOCK_API_MODULE_OPTIONS,
	BLOCK_API_SERVICE,
	BlockchainApiModuleOptions,
	IBlockApiService,
} from '../typing';
import { USERS_REPOSITORY, IUsersRepository } from '~api/domain/users/typing';

@Injectable()
export class DIDSeed {
	@Inject(BLOCK_API_MODULE_OPTIONS)
	private readonly options: BlockchainApiModuleOptions;

	@Inject(USERS_REPOSITORY)
	private readonly usersRepository: IUsersRepository;

	@Inject(BLOCK_API_SERVICE)
	private readonly blockchainApiService: IBlockApiService;

	onModuleInit() {
		if (this.options.autoInitDID) this.seed();
	}

	private async seed() {
		const users = await this.usersRepository.find();

		console.log('users', users);

		for await (const user of users) {
			await this.blockchainApiService.initDIDdocument(user.id);
		}
	}
}
