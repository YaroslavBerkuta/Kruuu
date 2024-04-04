import { DynamicModule, Module } from '@nestjs/common';
import { ConfirmationModule, MailerModule, SessionsModule, UsersModule } from '~api/domain';
import { APP_USERS_CONTROLLERS } from './controllers';
import { AppUsersRegisterService } from './services';

@Module({})
export class AppUsersModule {
	static forRoot(): DynamicModule {
		return {
			module: AppUsersModule,
			imports: [
				UsersModule.forFeature(),
				ConfirmationModule.forFeature(),
				MailerModule.forFeature(),
				SessionsModule.forFeature(),
			],
			providers: [AppUsersRegisterService],
			controllers: APP_USERS_CONTROLLERS,
		};
	}
}
