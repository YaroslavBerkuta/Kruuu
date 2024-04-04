import { DynamicModule, Module } from '@nestjs/common';
import { TagsModule } from '~api/domain';
import { JwtModule } from '~api/libs';
import { AppTagsController } from './controllers';
import { AppTagsService } from './services';

@Module({})
export class AppTagsModule {
	static forRoot(): DynamicModule {
		return {
			module: AppTagsModule,
			imports: [TagsModule.forFeature(), JwtModule.forFeature()],
			providers: [AppTagsService],
			controllers: [AppTagsController],
		};
	}
}
