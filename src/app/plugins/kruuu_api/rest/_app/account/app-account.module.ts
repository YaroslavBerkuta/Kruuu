import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationModule, JobModule, SessionsModule, UsersModule } from '~api/domain';
import { AppAccountController } from './app-account.controller';
import { AppAccountService } from './app-account.service';
import { JwtModule } from '~api/libs';
import { ProjectsModule } from '~api/domain/projects/projects.module';
@Module({})
export class AppAccountModule {
	static forRoot(): DynamicModule {
		return {
			module: AppAccountModule,
			imports: [
				UsersModule.forFeature(),
				SessionsModule.forFeature(),
				JwtModule.forFeature(),
				ProjectsModule.forFeature(),
				JobModule.forFeature(),
				ApplicationModule.forFeature(),
			],
			controllers: [AppAccountController],
			providers: [AppAccountService],
		};
	}
}
