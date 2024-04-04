import { DynamicModule, Module } from '@nestjs/common';
import { provideEntity } from '~api/libs';
import { provideClass } from '~api/shared';
import { JobModule } from '../jobs/jobs.module';
import { Application } from './entities';
import { ApplicationService } from './services';
import { APPLICATIONS_REPOSITORY, APPLICATIONS_SERVICE } from './typing';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import { RealTimeModule } from '../real-time/real-time.module';
import { UsersModule } from '../users/users.module';
import { WalletsModule } from '..';
import { ProjectsModule } from '../projects/projects.module';

@Module({})
export class ApplicationModule {
	static getProviders() {
		return [
			provideEntity(APPLICATIONS_REPOSITORY, Application),
			provideClass(APPLICATIONS_SERVICE, ApplicationService),
		];
	}

	static imports() {
		return [
			UsersModule.forFeature(),
			JobModule.forFeature(),
			RealTimeModule.forFeature(),
			BlockchainAPIModule.forFeature(),
			WalletsModule.forFeature(),
			ProjectsModule.forFeature(),
		];
	}

	static forRoot(): DynamicModule {
		return {
			module: ApplicationModule,
			providers: [...this.getProviders()],
			imports: this.imports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: ApplicationModule,
			providers: this.getProviders(),
			imports: this.imports(),
			exports: [APPLICATIONS_REPOSITORY, APPLICATIONS_SERVICE],
		};
	}
}
