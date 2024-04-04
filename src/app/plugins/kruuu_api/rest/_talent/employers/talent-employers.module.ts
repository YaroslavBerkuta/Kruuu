import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationModule, EmployersModule, SocialModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { TalentEmployersController } from './controllers';
import { TalentEmployersService } from './services';

@Module({})
export class TalentEmployersModule {
	static forRoot(): DynamicModule {
		return {
			module: TalentEmployersModule,
			imports: [
				EmployersModule.forFeature(),
				SocialModule.forFeature(),
				GalleryModule.forFeature(),
				ApplicationModule.forFeature(),
			],
			providers: [TalentEmployersService],
			controllers: [TalentEmployersController],
		};
	}
}
