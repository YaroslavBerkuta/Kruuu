import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

import { NOTIFICATIONS_REPOSITORY } from '../typing/consts';
import {
	IAddUserDevicePayload,
	INotificationsService,
	ISaveNotificationsSettingsPayload,
	IStoreNotificationPayload,
	NotificationsRepository,
} from '../typing/interfaces';
import { NotificationsGroup } from '../typing/enums';
import { NotificationsSettingsService } from './notifications-settings.service';
import { NotificationsTransferService } from './notifications-transfer.service';
import { NotificationsUsersDevicesService } from './notifications-user-devices.service';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { IPagination, paginateAndGetMany, transformFileUrl } from '~api/shared';

@Injectable()
export class NotificationsService implements INotificationsService {
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;
	@Inject(NOTIFICATIONS_REPOSITORY)
	private notificationsRepository: NotificationsRepository;

	constructor(
		private notificationsSettingsService: NotificationsSettingsService,
		private notificationsTransferService: NotificationsTransferService,
		private notificationsUsersDevicesService: NotificationsUsersDevicesService,
	) {}

	public async addNotification(payload: IStoreNotificationPayload) {
		let isOnline = this.wsService.isUserOnline(payload.userId);
		let notification;

		if (isOnline && payload.group == NotificationsGroup.Chats) {
			this.wsService.emitToUser(payload.userId, 'push/notification', {
				message: payload.content,
				data: payload?.data,
				image: transformFileUrl(payload?.imageUrl),
			});
		} else if (isOnline && payload.group !== NotificationsGroup.Chats) {
			notification = await this.saveToDB(payload);
			this.wsService.emitToUser(payload.userId, 'push/notification', {
				message: payload.content,
				data: payload?.data,
				image: transformFileUrl(payload?.imageUrl),
			});
		} else {
			notification = await this.saveToDB(payload);
			this.wsService.emitToUser(payload.userId, 'push/notification', {
				message: payload.content,
				data: payload?.data,
				image: transformFileUrl(payload?.imageUrl),
			});
			await this.notificationsTransferService.checkSettingsAndSend(
				notification,
				payload.isPushMuted,
			);
		}
	}

	private async saveToDB(payload: IStoreNotificationPayload) {
		if (payload.data && payload.data.items) return this.saveMany(payload);
		return this.saveOne(payload);
	}

	private async saveOne(payload: IStoreNotificationPayload) {
		const notification = await this.notificationsRepository.save({
			title: payload.title,
			content: payload.content || '',
			data: payload.data || {},
			imageUrl: payload.imageUrl,
			group: payload.group || NotificationsGroup.Other,
			isRead: false,
			userId: payload.userId,
		});

		this.wsService.emitToUser(notification.userId, 'push/notification', { notification });

		return notification;
	}

	private async saveMany(payload: IStoreNotificationPayload) {
		for await (const item of payload.data.items) {
			const notification = await this.notificationsRepository.save({
				title: payload.title,
				content: `${payload.data.inAppContent} ${item.name}`,
				data: { type: payload.data.type, ...item },
				group: payload.group || NotificationsGroup.Other,
				isRead: false,
				userId: payload.userId,
			});
			this.wsService.emitToUser(notification.userId, 'notification', { notification });
		}

		const safeNotification = {
			title: payload.title,
			content: payload.content || '',
			data: payload.data || {},
			group: payload.group || NotificationsGroup.Other,
			isRead: false,
			userId: payload.userId,
		};
		return safeNotification;
	}

	public async getNotifications(userId: number, pagination: IPagination) {
		const query = this.notificationsRepository
			.createQueryBuilder('it')
			.orderBy('it.createAt', 'DESC')
			.where('it.userId = :userId', { userId });

		if (pagination.searchString)
			query.andWhere('it.title ILIKE :searchString', {
				searchString: `%${pagination.searchString}%`,
			});

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		return {
			items: items.map(it => ({
				...it,
				imageUrl: transformFileUrl(it.imageUrl),
			})),
			count,
		};
	}

	public async getUnreadNotificationsByGroups(userId: number) {
		const countsByGroups = {} as Record<string, number>;

		for (const group in NotificationsGroup) {
			countsByGroups[group.toLowerCase()] = await this.notificationsRepository
				.createQueryBuilder('it')
				.where({ userId, isRead: false })
				.andWhere('it.group = :group', { group: NotificationsGroup[group] })
				.getCount();
		}

		return countsByGroups;
	}

	public async getUserUnreadNotificationsCount(userId: number) {
		return await this.notificationsRepository
			.createQueryBuilder('it')
			.where({ userId, isRead: false })
			.getCount();
	}

	public async readUserNotifications(userId: number) {
		if (!userId) return;

		await this.notificationsRepository
			.createQueryBuilder('it')
			.update()
			.set({ isRead: true })
			.where('userId = :userId AND isRead = false', { userId })
			.execute();
	}

	public async readNotificationsByGroup(userId: number, group: NotificationsGroup) {
		if (!userId) return;

		await this.notificationsRepository
			.createQueryBuilder('it')
			.update()
			.set({ isRead: true })
			.where('userId = :userId AND isRead = false', { userId })
			.andWhere('group = :group', { group })
			.execute();
	}

	public async readNotificationsByIds(userId: number, ids: number[]) {
		if (!userId) return;

		await this.notificationsRepository
			.createQueryBuilder('it')
			.update()
			.set({ isRead: true })
			.where('userId = :userId AND isRead = false', { userId })
			.andWhere('id IN (:...ids)', { ids })
			.execute();
	}
	public async getUserNotificationsSettings(userId: number) {
		return this.notificationsSettingsService.getSettings(userId);
	}

	public async updateUserNotificationsSettings(
		userId: number,
		payload: ISaveNotificationsSettingsPayload,
	) {
		return this.notificationsSettingsService.update(userId, payload);
	}

	public addUserDevice(payload: IAddUserDevicePayload) {
		return this.notificationsUsersDevicesService.addUserDevice(payload);
	}

	public removeUserDevice(uuid: string) {
		return this.notificationsUsersDevicesService.removeUserDevice(uuid);
	}

	public removeAllUserDevices(userId: number) {
		return this.notificationsUsersDevicesService.removeAllUserDevices(userId);
	}
}
