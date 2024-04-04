import { DynamicModule, Module } from '@nestjs/common';
import { provideEntity } from '~api/libs';
import { INSTITUTION_REPOSITORY, INSTITUTION_SERVICES } from './typing';
import { InstitutionInfo } from './entities';
import { provideClass } from '~api/shared';
import { InstitutionService } from './services';
import { UsersModule } from '..';

@Module({})
export class InstitutionModule {
	static getProviders() {
		return [
			provideEntity(INSTITUTION_REPOSITORY, InstitutionInfo),
			provideClass(INSTITUTION_SERVICES, InstitutionService),
		];
	}

	static imports() {
		return [UsersModule.forFeature()];
	}

	static forRoot(): DynamicModule {
		return {
			module: InstitutionModule,
			providers: this.getProviders(),
			imports: this.imports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: InstitutionModule,
			providers: this.getProviders(),
			exports: [INSTITUTION_SERVICES, INSTITUTION_REPOSITORY],
			imports: this.imports(),
		};
	}
}
