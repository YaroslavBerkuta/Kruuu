import { Repository } from 'typeorm';
import { INotification } from './notifications.interfaces';
import { INotificationUserDevice } from './notification-users-device.interface';
import { INotificationsSettings } from './notifications-settings.interfaces';

export type NotificationsRepository = Repository<INotification>;
export type NotificationUserDevicesRepository = Repository<INotificationUserDevice>;
export type NotificationsSettingsRepository = Repository<INotificationsSettings>;
