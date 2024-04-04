import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as _ from 'lodash';
import { In } from 'typeorm';
import { NotificationsSettingsService } from './notifications-settings.service';
import { NOTIFICATIONS_REPOSITORY, NOTIFICATIONS_USERS_DEVICES_REPOSITORY } from '../typing/consts';
import {
	INotification,
	INotificationsTransferService,
	NotificationUserDevicesRepository,
	NotificationsRepository,
} from '../typing/interfaces';
import { ApplicationType } from '~api/shared';
import { PUSH_NOTIFICATIONS_SERVICE } from '~api/libs/push-notifications/consts';
import { IPushNotificationsService } from '~api/libs/push-notifications/interfaces';

@Injectable()
export class NotificationsTransferService implements INotificationsTransferService {
	constructor(
		@Inject(NOTIFICATIONS_REPOSITORY)
		private notificationsRepository: NotificationsRepository,

		@Inject(NOTIFICATIONS_USERS_DEVICES_REPOSITORY)
		private deviceRepository: NotificationUserDevicesRepository,

		@Inject(PUSH_NOTIFICATIONS_SERVICE)
		private pushNotificationsService: IPushNotificationsService,

		private notificationsSettingsService: NotificationsSettingsService,
	) {}

	public async sendById(id: number) {
		const notification = await this.notificationsRepository.findOne({ where: { id } });

		if (!notification) throw new NotFoundException('Notification not found');

		return this.checkSettingsAndSend(notification);
	}

	public async checkSettingsAndSend(notification: Partial<INotification>, isPushMuted?: boolean) {
		const headings = {
			en: notification.title,
		};

		const contents = {
			en: notification.content,
		};

		if (!isPushMuted) {
			const applicationTypes = await this.getAllowedApplicationTypes(notification.userId);

			await this.sendToUser(notification, applicationTypes, headings, contents);
		}
	}

	private async getAllowedApplicationTypes(userId: number) {
		const settings = await this.notificationsSettingsService.getSettings(userId);
		const allowedApplicationTypes = [];
		if (settings.appEnabled) allowedApplicationTypes.push(ApplicationType.App);
		if (settings.webEnabled) allowedApplicationTypes.push(ApplicationType.Desktop);

		return allowedApplicationTypes;
	}

	private async sendToUser(
		notification: Partial<INotification>,
		applicationTypes: ApplicationType[],
		headings: any,
		contents: any,
	) {
		const devices = await this.deviceRepository.find({
			where: {
				userId: notification.userId,
				applicationType: In(applicationTypes),
			},
		});
		if (_.isEmpty(devices)) return;

		await this.pushNotificationsService.createNotification({
			headings,
			contents,
			data: notification.data,
			ios_badgeCount: 1,
			ios_badgeType: 'Increase',
			include_player_ids: devices.map(it => it.notificationUserId),
		});
	}
}
