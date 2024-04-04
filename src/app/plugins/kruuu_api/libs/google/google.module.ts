import { DynamicModule, Global, Module } from '@nestjs/common';
import { IGoogleAsyncModuleParams, IGoogleModuleParams } from './interfaces';
import { GoogleService } from './services';

@Global()
@Module({})
export class GoogleModule {
	static forRootAsync(options: IGoogleAsyncModuleParams): DynamicModule {
		return {
			module: GoogleModule,
			providers: [
				{
					provide: 'GOOGLE_MODULE_PARAMS',
					useFactory: options.useFactory,
					inject: options.inject || [],
				},
				GoogleService,
			],
			exports: [GoogleService],
		};
	}

	static forRoot(options: IGoogleModuleParams): DynamicModule {
		return {
			module: GoogleModule,
			providers: [
				{
					provide: 'GOOGLE_MODULE_PARAMS',
					useValue: options,
				},
				GoogleService,
			],
			exports: [GoogleService],
		};
	}
}
