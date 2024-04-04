import { INewNotificationToUsers, IPushNotificationsUser } from './push-notifications.interfaces';

export interface IPushNotificationsService {
	getUserInfo(pushNotificationsUserId: string): Promise<IPushNotificationsUser>;

	createNotification(data: INewNotificationToUsers): Promise<void>;
}
