import { DynamicModule, Module } from '@nestjs/common';
import { SocialModule, TagsModule, TalentsModule } from '~api/domain';
import { JwtModule } from '~api/libs';
import { EmployerTalentsController } from './controllers';
import { EmployerTalentsService } from './services';

@Module({})
export class EmployerTalentsModule {
	static forRoot(): DynamicModule {
		return {
			module: EmployerTalentsModule,
			imports: [
				TalentsModule.forFeature(),
				JwtModule.forFeature(),
				TagsModule.forFeature(),
				SocialModule.forFeature(),
			],
			providers: [EmployerTalentsService],
			controllers: [EmployerTalentsController],
		};
	}
}
