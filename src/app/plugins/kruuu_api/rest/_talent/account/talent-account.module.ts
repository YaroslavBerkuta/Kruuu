import { DynamicModule, Module } from '@nestjs/common';
import { SocialModule, TagsModule, TalentsModule } from '~api/domain';
import { JwtModule } from '~api/libs';
import { TalentAccountController } from './controllers';
import { TalentAccountService } from './services';

@Module({})
export class TalentAccountModule {
	static forRoot(): DynamicModule {
		return {
			module: TalentAccountModule,
			imports: [
				TalentsModule.forFeature(),
				JwtModule.forFeature(),
				TagsModule.forFeature(),
				SocialModule.forFeature(),
			],
			providers: [TalentAccountService],
			controllers: [TalentAccountController],
		};
	}
}
