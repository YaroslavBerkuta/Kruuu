import { DynamicModule, Global, Module } from '@nestjs/common';
import { IAppleAsyncModuleParams, IAppleModuleParams } from './interfaces';
import { AppleService } from './services';

@Global()
@Module({})
export class AppleModule {
	static forRootAsync(options: IAppleAsyncModuleParams): DynamicModule {
		return {
			module: AppleModule,
			providers: [
				{
					provide: 'APPLE_MODULE_PARAMS',
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				AppleService,
			],
			exports: [AppleService],
		};
	}

	static forRoot(options: IAppleModuleParams): DynamicModule {
		return {
			module: AppleModule,
			providers: [
				{
					provide: 'APPLE_MODULE_PARAMS',
					useValue: options,
				},
				AppleService,
			],
			exports: [AppleService],
		};
	}
}
