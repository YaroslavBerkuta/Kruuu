import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationModule, EmployersModule, SocialModule, TagsModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { JwtModule } from '~api/libs';
import { EmployerAccountController } from './controllers';
import { EmployerAccountService } from './services';

@Module({})
export class EmployerAccountModule {
	static forRoot(): DynamicModule {
		return {
			module: EmployerAccountModule,
			imports: [
				EmployersModule.forFeature(),
				JwtModule.forFeature(),
				TagsModule.forFeature(),
				SocialModule.forFeature(),
				GalleryModule.forFeature(),
				ApplicationModule.forFeature(),
			],
			providers: [EmployerAccountService],
			controllers: [EmployerAccountController],
		};
	}
}
