import { DynamicModule, Module } from '@nestjs/common';
import { provideEntity } from '~api/libs';
import { provideClass } from '~api/shared';
import { GalleryModule } from '../galleries/gallery.module';
import { SocialModule } from '../social/social.module';
import { UsersModule } from '../users/users.module';
import { EmployerInfo } from './enitites';
import { EmployersService } from './services';
import { EMPLOYERS_INFO_REPOSITORY, EMPLOYERS_INFO_SERVICE } from './typing';

@Module({})
export class EmployersModule {
	private static getProviders() {
		return [
			provideEntity(EMPLOYERS_INFO_REPOSITORY, EmployerInfo),
			provideClass(EMPLOYERS_INFO_SERVICE, EmployersService),
		];
	}

	static getImports() {
		return [SocialModule.forFeature(), GalleryModule.forFeature(), UsersModule.forFeature()];
	}

	static forRoot(): DynamicModule {
		return {
			module: EmployersModule,
			imports: EmployersModule.getImports(),
			providers: EmployersModule.getProviders(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: EmployersModule,
			imports: EmployersModule.getImports(),
			exports: [EMPLOYERS_INFO_REPOSITORY, EMPLOYERS_INFO_SERVICE],
			providers: EmployersModule.getProviders(),
		};
	}
}
