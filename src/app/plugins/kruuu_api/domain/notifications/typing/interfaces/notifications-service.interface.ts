import { ApplicationType, IPagination } from '~api/shared';
import { NotificationsGroup } from '../enums';
import { INotificationsSettings } from './notifications-settings.interfaces';
import { INotification } from './notifications.interfaces';

export interface INotificationsService {
	readUserNotifications(userId: number): Promise<void>;
	readNotificationsByGroup(userId: number, group: NotificationsGroup): Promise<void>;
	readNotificationsByIds(userId: number, ids: number[]): Promise<void>;
	getUserUnreadNotificationsCount(userId: number): Promise<number>;
	addNotification(payload: IStoreNotificationPayload): Promise<void>;
	getUserNotificationsSettings(userId: number): Promise<INotificationsSettings>;
	updateUserNotificationsSettings(
		userId: number,
		payload: ISaveNotificationsSettingsPayload,
	): Promise<INotificationsSettings>;

	addUserDevice(payload: IAddUserDevicePayload): Promise<void>;
	removeUserDevice(uuid: string): Promise<void>;
	removeAllUserDevices(userId: number): Promise<void>;
	getNotifications(
		userId: number,
		pagination: IPagination,
	): Promise<{
		items: INotification[];
		count: number;
	}>;
	getUnreadNotificationsByGroups(userId: number): Promise<Record<string, number>>;
}

export interface INotificationsUsersDevicesService {
	addUserDevice(payload: IAddUserDevicePayload): Promise<void>;
	removeUserDevice(deviceUuid: string): Promise<void>;
	removeAllUserDevices(userId: number): Promise<void>;
}

export interface INotificationsTransferService {
	sendById(id: number): Promise<void>;
	checkSettingsAndSend(notification: Partial<INotification>, isPushMuted?: boolean): Promise<void>;
}

export interface INotificationsSettingsService {
	getSettings(userId: number): Promise<INotificationsSettings>;
	update(
		userId: number,
		payload: ISaveNotificationsSettingsPayload,
	): Promise<INotificationsSettings>;
}

export interface IStoreNotificationPayload {
	userId: number;
	title: string;
	content?: string;
	group?: NotificationsGroup;
	data?: Record<any, any> | any;
	isPushMuted?: boolean;
	imageUrl?: string;
}

export interface ISaveNotificationsSettingsPayload {
	appEnabled?: boolean;
	webEnabled?: boolean;
}

export interface IAddUserDevicePayload {
	userId: number;
	deviceUuid: string;
	applicationType: ApplicationType;
	notificationUserId: string;
}
