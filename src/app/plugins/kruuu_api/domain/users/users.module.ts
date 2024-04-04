import { DynamicModule, Module } from '@nestjs/common';

import {
	PASSWORD_HASH_SALT,
	USERS_ACTIVATED_CODE_REPOSITORY,
	USERS_ACTIVATED_CODE_SERVICE,
	USERS_REPOSITORY,
	USERS_SERVICE,
	USERS_SOCIALS_REPOSITORY,
	USERS_USED_CODES_REPOSITORY,
	UsersModuleOptions,
} from './typing';

import { User, UserCode, UserSocial, UserUsedCode } from './entities';

import { UsersService, USERS_SERVICES } from './services';
import { WalletsModule } from '../wallets/wallets.module';
import { provideClass } from '~api/shared';
import { provideEntity } from '~api/libs';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import { UserActivedetCodeService } from './services/user-activeted-code.service';

@Module({})
export class UsersModule {
	static options: UsersModuleOptions;

	static getProviders() {
		return [
			provideClass(USERS_SERVICE, UsersService),
			{
				provide: PASSWORD_HASH_SALT,
				useValue: UsersModule.options.passwordHashSalt,
			},
			provideClass(USERS_ACTIVATED_CODE_SERVICE, UserActivedetCodeService),
			provideEntity(USERS_REPOSITORY, User),
			provideEntity(USERS_SOCIALS_REPOSITORY, UserSocial),
			provideEntity(USERS_ACTIVATED_CODE_REPOSITORY, UserCode),
			provideEntity(USERS_USED_CODES_REPOSITORY, UserUsedCode),
			...USERS_SERVICES,
		];
	}

	static getExports() {
		return [USERS_SERVICE, USERS_REPOSITORY, USERS_ACTIVATED_CODE_SERVICE];
	}

	static getImports() {
		return [WalletsModule.forFeature(), BlockchainAPIModule.forFeature()];
	}

	static forRoot(options: UsersModuleOptions): DynamicModule {
		UsersModule.options = options;

		return {
			module: UsersModule,
			providers: [...UsersModule.getProviders()],
			imports: UsersModule.getImports(),
			exports: UsersModule.getExports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: UsersModule,
			providers: UsersModule.getProviders(),
			imports: UsersModule.getImports(),
			exports: UsersModule.getExports(),
		};
	}
}
