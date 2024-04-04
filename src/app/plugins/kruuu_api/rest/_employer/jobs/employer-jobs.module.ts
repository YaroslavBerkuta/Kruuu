import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationModule, JobModule, TagsModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { EmployerJobsController } from './employer-jobs.controller';
import { EmployerJobsService } from './employer-jobs.service';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import { ProjectsModule } from '~api/domain/projects/projects.module';

@Module({})
export class EmployerJobsModule {
	static forRoot(): DynamicModule {
		return {
			module: EmployerJobsModule,
			providers: [EmployerJobsService],
			controllers: [EmployerJobsController],
			imports: [
				JobModule.forFeature(),
				TagsModule.forFeature(),
				GalleryModule.forFeature(),
				ApplicationModule.forFeature(),
				ProjectsModule.forFeature(),
				BlockchainAPIModule.forFeature(),
			],
		};
	}
}
