import { DynamicModule, Module } from '@nestjs/common';
import { REDIS_OPTIONS } from './consts';
import { IRedisModuleOptions } from './interfaces';
import { RedisService } from './services';

@Module({})
export class RedisModule {
	static options: IRedisModuleOptions;

	static getProviders() {
		return [RedisService, { provide: REDIS_OPTIONS, useValue: this.options }];
	}

	static getExports() {
		return [RedisService];
	}

	static forRoot(options: IRedisModuleOptions): DynamicModule {
		RedisModule.options = options;

		return {
			module: RedisModule,
			providers: RedisModule.getProviders(),
			exports: RedisModule.getExports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: RedisModule,
			providers: RedisModule.getProviders(),
			exports: RedisModule.getExports(),
		};
	}
}
