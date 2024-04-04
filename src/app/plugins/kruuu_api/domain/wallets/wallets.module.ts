/* eslint-disable import/extensions */
import { DynamicModule, Module } from '@nestjs/common';

import { provideClass } from '~api/shared';
import { provideEntity } from '~api/libs';

import { Wallet, WalletAction } from './entities';
import { WalletsActionsService, WalletsService } from './services';

import {
	WALLETS_ACTIONS_REPOSITORY,
	WALLETS_ACTIONS_SERVICE,
	WALLETS_REPOSITORY,
	WALLETS_SERVICE,
} from './typing/consts';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import { TokensEventsListener } from './events';

@Module({})
export class WalletsModule {
	private static getProviders() {
		return [
			provideEntity(WALLETS_REPOSITORY, Wallet),
			provideEntity(WALLETS_ACTIONS_REPOSITORY, WalletAction),
			provideClass(WALLETS_SERVICE, WalletsService),
			provideClass(WALLETS_ACTIONS_SERVICE, WalletsActionsService),
		];
	}

	static forRoot(): DynamicModule {
		return {
			module: WalletsModule,
			imports: [BlockchainAPIModule.forFeature()],
			providers: [...this.getProviders(), TokensEventsListener],
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: WalletsModule,
			imports: [BlockchainAPIModule.forFeature()],
			providers: this.getProviders(),
			exports: [
				WALLETS_REPOSITORY,
				WALLETS_SERVICE,
				WALLETS_ACTIONS_SERVICE,
				WALLETS_ACTIONS_REPOSITORY,
			],
		};
	}
}
