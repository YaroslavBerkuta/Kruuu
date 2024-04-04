import { DynamicModule, Module } from '@nestjs/common';

import { provideClass } from '~api/shared';
import { NOTIFICATION_SERVICES, NotificationsService } from './services';
import {
	NOTIFICATIONS_REPOSITORY,
	NOTIFICATIONS_SERVICE,
	NOTIFICATIONS_SETTINGS_REPOSITORY,
	NOTIFICATIONS_USERS_DEVICES_REPOSITORY,
} from './typing/consts';
import { Notification, NotificationUserDevice } from './entities';
import { RealTimeModule } from '../real-time/real-time.module';

import { NotificationsSettings } from './entities/notifications-settings.entity';
import { EmployersModule } from '../employer/employer.module';
import { TalentsModule } from '../talents/talents.module';
import { NotificationsEventsHandlerService } from './services/notifications-events.service';
import { GalleryModule } from '../galleries/gallery.module';
import { JobModule } from '../jobs/jobs.module';
import { ApplicationModule } from '../applications/applications.module';
import { provideEntity } from '~api/libs';
import { PushNotificationsModule } from '~api/libs/push-notifications/push-notifications.module';

@Module({})
export class NotificationsModule {
	static getProviders() {
		return [
			provideClass(NOTIFICATIONS_SERVICE, NotificationsService),
			provideEntity(NOTIFICATIONS_REPOSITORY, Notification),
			provideEntity(NOTIFICATIONS_USERS_DEVICES_REPOSITORY, NotificationUserDevice),
			provideEntity(NOTIFICATIONS_SETTINGS_REPOSITORY, NotificationsSettings),

			...NOTIFICATION_SERVICES,
		];
	}

	static forRoot(): DynamicModule {
		return {
			module: NotificationsModule,
			providers: [...this.getProviders(), NotificationsEventsHandlerService],
			imports: [
				RealTimeModule.forFeature(),
				PushNotificationsModule.forFeature(),
				EmployersModule.forFeature(),
				TalentsModule.forFeature(),
				GalleryModule.forFeature(),
				JobModule.forFeature(),
				ApplicationModule.forFeature(),
			],
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: NotificationsModule,
			providers: this.getProviders(),
			imports: [
				RealTimeModule.forFeature(),
				PushNotificationsModule.forFeature(),
				EmployersModule.forFeature(),
				TalentsModule.forFeature(),
			],
			exports: [NOTIFICATIONS_SERVICE],
		};
	}
}
