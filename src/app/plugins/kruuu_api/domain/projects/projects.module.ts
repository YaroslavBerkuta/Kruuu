import { DynamicModule, Module } from '@nestjs/common';
import { provideEntity } from '~api/libs';
import { provideClass } from '~api/shared';
import { SocialModule } from '../social/social.module';
import { PROJECTS_REPOSITORY, PROJECTS_SERVICES } from './consts';
import { Project } from './entities';
import { ProjectService } from './services';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import { UsersModule } from '../users/users.module';
import { RealTimeModule } from '../real-time/real-time.module';
import { GalleryModule } from '../galleries/gallery.module';

@Module({})
export class ProjectsModule {
	static getProviders() {
		return [
			provideEntity(PROJECTS_REPOSITORY, Project),
			provideClass(PROJECTS_SERVICES, ProjectService),
		];
	}

	static imports() {
		return [
			SocialModule.forFeature(),
			BlockchainAPIModule.forFeature(),
			UsersModule.forFeature(),
			RealTimeModule.forFeature(),
			GalleryModule.forFeature(),
		];
	}

	static exports() {
		return [PROJECTS_REPOSITORY, PROJECTS_SERVICES];
	}

	static forRoot(): DynamicModule {
		return {
			module: ProjectsModule,
			providers: [...this.getProviders()],
			imports: this.imports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: ProjectsModule,
			providers: this.getProviders(),
			imports: this.imports(),
			exports: this.exports(),
		};
	}
}
