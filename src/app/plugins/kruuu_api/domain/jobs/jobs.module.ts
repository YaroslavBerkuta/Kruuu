import { DynamicModule, Module } from '@nestjs/common';

import { provideEntity } from '~api/libs';
import { provideClass } from '~api/shared';
import {
	JOB_APPEARANCE_REPOSITORY,
	JOB_MEASUREMENT_REPOSITORY,
	JOB_REPOSITORY,
	JOB_RESIDENCE_REPOSITORY,
	JOB_SERVICES,
	JOB_TO_TAG_REPOSITORY,
} from './consts';
import { Job, JobAppearance, JobMeasurement, JobResidence, JobToTag } from './entities';
import { JobService } from './services/jobs.service';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import { RealTimeModule } from '../real-time/real-time.module';
import { ProjectsModule } from '../projects/projects.module';
import { GalleryModule } from '../galleries/gallery.module';

@Module({})
export class JobModule {
	static getProviders() {
		return [
			provideEntity(JOB_REPOSITORY, Job),
			provideEntity(JOB_APPEARANCE_REPOSITORY, JobAppearance),
			provideEntity(JOB_MEASUREMENT_REPOSITORY, JobMeasurement),
			provideEntity(JOB_TO_TAG_REPOSITORY, JobToTag),
			provideEntity(JOB_RESIDENCE_REPOSITORY, JobResidence),
			provideClass(JOB_SERVICES, JobService),
		];
	}

	static imports() {
		return [
			BlockchainAPIModule.forFeature(),
			RealTimeModule.forFeature(),
			ProjectsModule.forFeature(),
			GalleryModule.forFeature(),
		];
	}

	static exports() {
		return [JOB_REPOSITORY, JOB_SERVICES];
	}

	static forRoot(): DynamicModule {
		return {
			module: JobModule,
			providers: [...this.getProviders()],
			imports: this.imports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: JobModule,
			providers: this.getProviders(),
			imports: this.imports(),
			exports: this.exports(),
		};
	}
}
