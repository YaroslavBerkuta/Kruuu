import { DynamicModule, Module } from '@nestjs/common';
import { MainGateway } from './gateways';
import { JwtWsGuard } from './guards';
import { REAL_TIME_SERVICES, WsService } from './services';
import { REAL_TIME_SERVICE } from './typing';
import { provideClass } from '~api/shared';
import { JwtModule } from '~api/libs';

@Module({})
export class RealTimeModule {
	static getProviders() {
		return [
			provideClass(REAL_TIME_SERVICE, WsService),
			MainGateway,
			JwtWsGuard,
			...REAL_TIME_SERVICES,
		];
	}

	static getExports() {
		return [REAL_TIME_SERVICE];
	}

	static getImports() {
		return [JwtModule.forFeature()];
	}

	static forRoot(): DynamicModule {
		return {
			module: RealTimeModule,
			providers: RealTimeModule.getProviders(),
			imports: RealTimeModule.getImports(),
			exports: RealTimeModule.getExports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: RealTimeModule,
			providers: RealTimeModule.getProviders(),
			imports: RealTimeModule.getImports(),
			exports: RealTimeModule.getExports(),
		};
	}
}
