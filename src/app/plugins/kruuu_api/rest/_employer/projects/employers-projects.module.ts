import { DynamicModule, Module } from '@nestjs/common';
import {
	ApplicationModule,
	JobModule,
	SocialModule,
	TagsModule,
	UsersModule,
	WalletsModule,
} from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { ProjectsModule } from '~api/domain/projects/projects.module';
import { EmployerProjectsController } from './employers-projects.controller';
import { EmployerProjectsService } from './employers-projects.service';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';

@Module({})
export class EmployerProjectsModule {
	static forRoot(): DynamicModule {
		return {
			module: EmployerProjectsModule,
			controllers: [EmployerProjectsController],
			providers: [EmployerProjectsService],
			imports: [
				ProjectsModule.forFeature(),
				GalleryModule.forFeature(),
				TagsModule.forFeature(),
				JobModule.forFeature(),
				ApplicationModule.forFeature(),
				SocialModule.forFeature(),
				BlockchainAPIModule.forFeature(),
				UsersModule.forFeature(),
				WalletsModule.forFeature(),
			],
		};
	}
}
