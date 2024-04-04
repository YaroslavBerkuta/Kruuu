import { DynamicModule, Module } from '@nestjs/common';
import { ConfirmationCodesService } from './services';
import { CONFIRMATION_CODES_SERVICE } from './typing';
import { provideClass } from '~api/shared';
import { RedisModule } from '~api/libs';

@Module({})
export class ConfirmationModule {
	static getExports() {
		return [CONFIRMATION_CODES_SERVICE];
	}

	static getProviders() {
		return [provideClass(CONFIRMATION_CODES_SERVICE, ConfirmationCodesService)];
	}

	static getImports() {
		return [RedisModule.forFeature()];
	}

	static forRoot(): DynamicModule {
		return {
			module: ConfirmationModule,
			imports: ConfirmationModule.getImports(),
			providers: ConfirmationModule.getProviders(),
			exports: ConfirmationModule.getExports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: ConfirmationModule,
			imports: ConfirmationModule.getImports(),
			providers: ConfirmationModule.getProviders(),
			exports: ConfirmationModule.getExports(),
		};
	}
}
