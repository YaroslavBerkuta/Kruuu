import { DynamicModule, Module } from '@nestjs/common';

import { getPushNotificationsService } from './services';
import { PUSH_NOTIFICATIONS_OPTIONS, PUSH_NOTIFICATIONS_SERVICE } from './consts';
import { IPushNotifcationsModuleParams } from './interfaces';
import { HttpModule } from '@nestjs/axios';
import { provideClass } from '~api/shared';

@Module({})
export class PushNotificationsModule {
	static options: IPushNotifcationsModuleParams;

	static forRoot(options: IPushNotifcationsModuleParams): DynamicModule {
		PushNotificationsModule.options = options;

		return {
			module: PushNotificationsModule,
			imports: PushNotificationsModule.getImports(),
		};
	}

	static forFeature() {
		return {
			module: PushNotificationsModule,
			imports: PushNotificationsModule.getImports(),
			providers: PushNotificationsModule.getProviders(),
			exports: PushNotificationsModule.getExports(),
		};
	}

	static getImports() {
		return [HttpModule];
	}

	static getProviders() {
		return [
			{
				provide: PUSH_NOTIFICATIONS_OPTIONS,
				useValue: PushNotificationsModule.options,
			},
			provideClass(
				PUSH_NOTIFICATIONS_SERVICE,
				getPushNotificationsService(PushNotificationsModule.options.useService),
			),
		];
	}

	static getExports() {
		return [PUSH_NOTIFICATIONS_SERVICE];
	}
}
