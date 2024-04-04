import { Inject, Injectable } from '@nestjs/common';
import {
	AddUserDevicePayloadDto,
	ReadNotificationsByGroupDto,
	ReadNotificationsByIdsDto,
} from '../dto';
import { NOTIFICATIONS_SERVICE } from '~api/domain/notifications/typing/consts';
import { INotificationsService } from '~api/domain/notifications/typing/interfaces';
import { ApplicationType, IPagination } from '~api/shared';

@Injectable()
export class AppNotificationsService {
	constructor(
		@Inject(NOTIFICATIONS_SERVICE)
		private readonly notificationsService: INotificationsService,
	) {}

	public async getList(userId: number, pagination: IPagination) {
		return await this.notificationsService.getNotifications(userId, pagination);
	}

	public async getUnreadCountByGroups(userId: number) {
		return await this.notificationsService.getUnreadNotificationsByGroups(userId);
	}

	public async readAllUserNotifications(userId: number) {
		await this.notificationsService.readUserNotifications(userId);
	}

	public async readNotificationsByGroup(userId: number, dto: ReadNotificationsByGroupDto) {
		await this.notificationsService.readNotificationsByGroup(userId, dto.group);
	}

	public async readNotificationsByIds(userId: number, dto: ReadNotificationsByIdsDto) {
		await this.notificationsService.readNotificationsByIds(userId, dto.ids);
	}

	public async addDevice(userId: number, dto: AddUserDevicePayloadDto) {
		return await this.notificationsService.addUserDevice({
			userId,
			deviceUuid: dto.deviceUuid,
			notificationUserId: dto.notificationUserId,
			applicationType: ApplicationType.App,
		});
	}
}
