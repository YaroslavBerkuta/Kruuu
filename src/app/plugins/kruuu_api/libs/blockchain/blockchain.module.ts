import { DynamicModule, Module } from '@nestjs/common';
import { apiClient } from 'lisk-sdk';
import { CORE_API } from '~api/shared';
import {
	BLOCK_API_MODULE_OPTIONS,
	BLOCK_API_SERVICE,
	BLOCK_FEE_SERVICE,
	BlockchainApiModuleOptions,
} from './typing';
import { BlockchainApiService } from './blockchain.service';
import { User } from '~api/domain/users/entities';
import { USERS_REPOSITORY } from '~api/domain/users/typing';
import { provideEntity } from '../database';
import { TokensSeed } from './seeds';
import { RealTimeModule } from '~api/domain';
import { BlockchainEvents } from './blockchain.events';
import { BlockchainFeeService } from './services';
import { WALLETS_REPOSITORY } from '~api/domain/wallets/typing';
import { Wallet } from '~api/domain/wallets/entities';
import { DIDSeed } from './seeds/did.seed';
// import { TokensSeed } from './seeds';

@Module({})
export class BlockchainAPIModule {
	private static options: BlockchainApiModuleOptions;

	private static getProviders() {
		return [
			provideEntity(USERS_REPOSITORY, User),
			provideEntity(WALLETS_REPOSITORY, Wallet),
			{
				provide: CORE_API,
				useFactory: async () => {
					return await apiClient.createIPCClient('~/.lisk/kruuu-core');
				},
			},
			{
				provide: BLOCK_API_SERVICE,
				useClass: BlockchainApiService,
			},
			{
				provide: BLOCK_FEE_SERVICE,
				useClass: BlockchainFeeService,
			},
			{
				provide: BLOCK_API_MODULE_OPTIONS,
				useValue: this.options,
			},
		];
	}
	static forRoot(options: BlockchainApiModuleOptions): DynamicModule {
		this.options = options;
		return {
			module: BlockchainAPIModule,
			imports: [RealTimeModule.forFeature()],
			providers: [...this.getProviders(), TokensSeed, DIDSeed, BlockchainEvents],
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: BlockchainAPIModule,
			providers: this.getProviders(),
			exports: [CORE_API, BLOCK_API_SERVICE],
		};
	}
}
