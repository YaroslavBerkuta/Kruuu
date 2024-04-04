import { DynamicModule, Module } from '@nestjs/common';
import {
	ApplicationModule,
	EmployersModule,
	JobModule,
	SocialModule,
	TagsModule,
	TalentsModule,
} from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { ProjectsModule } from '~api/domain/projects/projects.module';
import { TalentMarketplaceController } from './talent-marketplace.controller';
import { TalentMarketplaceService } from './talent-marketplace.service';

@Module({})
export class TalentMarketplaceModule {
	static forRoot(): DynamicModule {
		return {
			module: TalentMarketplaceModule,
			imports: [
				TalentsModule.forFeature(),
				ProjectsModule.forFeature(),
				EmployersModule.forFeature(),
				JobModule.forFeature(),
				SocialModule.forFeature(),
				GalleryModule.forFeature(),
				TagsModule.forFeature(),
				ApplicationModule.forFeature(),
			],
			providers: [TalentMarketplaceService],
			controllers: [TalentMarketplaceController],
		};
	}
}
