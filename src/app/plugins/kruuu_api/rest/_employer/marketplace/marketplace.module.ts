import { DynamicModule, Module } from '@nestjs/common';
import {
	ApplicationModule,
	EmployersModule,
	JobModule,
	TagsModule,
	TalentsModule,
	UsersModule,
} from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { ProjectsModule } from '~api/domain/projects/projects.module';
import { EmployerMarketplaceController } from './marketplace.controller';
import { EmployerMarketplaceService } from './marketplace.service';

@Module({})
export class EmployerMarketplaceModule {
	static forRoot(): DynamicModule {
		return {
			module: EmployerMarketplaceModule,
			providers: [EmployerMarketplaceService],
			controllers: [EmployerMarketplaceController],
			imports: [
				UsersModule.forFeature(),
				EmployersModule.forFeature(),
				TalentsModule.forFeature(),
				JobModule.forFeature(),
				ProjectsModule.forFeature(),
				GalleryModule.forFeature(),
				TagsModule.forFeature(),
				ApplicationModule.forFeature(),
			],
		};
	}
}
