import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule, provideEntity, RedisModule } from '~api/libs';
import { provideClass } from '~api/shared';
import { Session } from './entities';
import { SESSIONS_GUARDS } from './guards';
import { SessionsService } from './services';
import { SESSIONS_REPOSITORY, SESSIONS_SERVICE } from './typing';

@Global()
@Module({})
export class SessionsModule {
	static getProviders() {
		return [
			provideClass(SESSIONS_SERVICE, SessionsService),
			provideEntity(SESSIONS_REPOSITORY, Session),
			...SESSIONS_GUARDS,
		];
	}

	static getImports() {
		return [JwtModule.forFeature(), RedisModule.forFeature()];
	}

	static getExports() {
		return [SESSIONS_SERVICE];
	}

	static forRoot(): DynamicModule {
		return {
			module: SessionsModule,
			imports: SessionsModule.getImports(),
			providers: SessionsModule.getProviders(),
			exports: SessionsModule.getExports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: SessionsModule,
			imports: SessionsModule.getImports(),
			providers: SessionsModule.getProviders(),
			exports: SessionsModule.getExports(),
		};
	}
}
