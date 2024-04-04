import { DynamicModule, Module } from '@nestjs/common';
import { NotificationsModule } from '~api/domain';
import { AppNotificationsController, AppNotificationsSettingsController } from './controllers';
import { AppNotificationsService, AppNotificationsSettingsService } from './services';

@Module({})
export class AppNotificationsModule {
	static forRoot(): DynamicModule {
		return {
			module: AppNotificationsModule,
			imports: [NotificationsModule.forFeature()],
			controllers: [AppNotificationsController, AppNotificationsSettingsController],
			providers: [AppNotificationsService, AppNotificationsSettingsService],
		};
	}
}
