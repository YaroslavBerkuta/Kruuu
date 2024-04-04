import { Inject, Injectable } from '@nestjs/common';
import { SaveAppNotificationsSettingsDto } from '../dto';
import { NOTIFICATIONS_SERVICE } from '~api/domain/notifications/typing/consts';
import { INotificationsService } from '~api/domain/notifications/typing/interfaces';

@Injectable()
export class AppNotificationsSettingsService {
	constructor(
		@Inject(NOTIFICATIONS_SERVICE)
		private readonly notificationsService: INotificationsService,
	) {}

	public update(userId: number, dto: SaveAppNotificationsSettingsDto) {
		return this.notificationsService.updateUserNotificationsSettings(userId, dto);
	}

	public getUserSettings(userId: number) {
		return this.notificationsService.getUserNotificationsSettings(userId);
	}
}
