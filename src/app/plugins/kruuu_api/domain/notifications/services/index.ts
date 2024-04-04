import { NotificationsSettingsService } from './notifications-settings.service';
import { NotificationsTransferService } from './notifications-transfer.service';
import { NotificationsUsersDevicesService } from './notifications-user-devices.service';
import { NotificationsService } from './notifications.service';

export const NOTIFICATION_SERVICES = [
	NotificationsService,
	NotificationsSettingsService,
	NotificationsTransferService,
	NotificationsUsersDevicesService,
];

export {
	NotificationsService,
	NotificationsSettingsService,
	NotificationsTransferService,
	NotificationsUsersDevicesService,
};
