import { DynamicModule, Module } from '@nestjs/common';
import { ConfirmationModule, MailerModule, SessionsModule, UsersModule } from '~api/domain';

import { AppAuthController, AppPasswordRecoveryController } from './controllers';
import { AppAuthService, AppPasswordRecoveryService } from './services';
import { JwtModule } from '~api/libs';

@Module({})
export class AppAuthModule {
	static forRoot(): DynamicModule {
		return {
			module: AppAuthModule,
			imports: [
				UsersModule.forFeature(),
				SessionsModule.forFeature(),
				JwtModule.forFeature(),
				ConfirmationModule.forFeature(),
				MailerModule.forFeature(),
			],
			providers: [AppAuthService, AppPasswordRecoveryService],
			controllers: [AppAuthController, AppPasswordRecoveryController],
		};
	}
}
