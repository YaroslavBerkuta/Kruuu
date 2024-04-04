import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NOTIFICATIONS_USERS_DEVICES_REPOSITORY } from '../typing/consts';
import {
	IAddUserDevicePayload,
	INotificationsUsersDevicesService,
	NotificationUserDevicesRepository,
} from '../typing/interfaces';
import { PUSH_NOTIFICATIONS_SERVICE } from '~api/libs/push-notifications/consts';
import { IPushNotificationsService } from '~api/libs/push-notifications/interfaces';

@Injectable()
export class NotificationsUsersDevicesService implements INotificationsUsersDevicesService {
	constructor(
		@Inject(NOTIFICATIONS_USERS_DEVICES_REPOSITORY)
		private deviceRepository: NotificationUserDevicesRepository,

		@Inject(PUSH_NOTIFICATIONS_SERVICE)
		private pushNotificationService: IPushNotificationsService,
	) {}

	public async addUserDevice(payload: IAddUserDevicePayload) {
		try {
			const user = await this.pushNotificationService.getUserInfo(payload.notificationUserId);
			if (!user) throw new BadRequestException('Notification user id is invalid');

			const existConnectedDevice = await this.deviceRepository.findOne({
				where: {
					deviceUuid: payload.deviceUuid,
				},
			});

			if (existConnectedDevice) {
				if (
					existConnectedDevice.notificationUserId !== payload.notificationUserId ||
					existConnectedDevice.userId !== payload.userId ||
					existConnectedDevice.applicationType !== payload.applicationType
				) {
					await this.deviceRepository.delete(existConnectedDevice.id);
					await this.deviceRepository.save({
						deviceUuid: payload.deviceUuid,
						userId: payload.userId,
						notificationUserId: payload.notificationUserId,
						applicationType: payload.applicationType,
					});
				}
			} else {
				await this.deviceRepository.save({
					deviceUuid: payload.deviceUuid,
					userId: payload.userId,
					notificationUserId: payload.notificationUserId,
					applicationType: payload.applicationType,
				});
			}
		} catch (e) {
			console.log('Error add user device', e);
			throw e;
		}
	}
	public async removeUserDevice(deviceUuid: string) {
		await this.deviceRepository.delete({ deviceUuid });
	}

	public async removeAllUserDevices(userId: number) {
		await this.deviceRepository.delete({ userId });
	}
}
