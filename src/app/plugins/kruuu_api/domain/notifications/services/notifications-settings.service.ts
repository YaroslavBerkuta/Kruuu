import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATIONS_SETTINGS_REPOSITORY } from '../typing/consts';
import {
	INotificationsSettingsService,
	ISaveNotificationsSettingsPayload,
	NotificationsSettingsRepository,
} from '../typing/interfaces';

@Injectable()
export class NotificationsSettingsService implements INotificationsSettingsService {
	constructor(
		@Inject(NOTIFICATIONS_SETTINGS_REPOSITORY)
		public notificationsSettingsRepository: NotificationsSettingsRepository,
	) {}

	public async getSettings(userId: number) {
		const result = await this.notificationsSettingsRepository.findOne({ where: { userId } });
		if (result) return result;
		return await this.notificationsSettingsRepository.save({ userId });
	}

	public async update(userId: number, payload: ISaveNotificationsSettingsPayload) {
		const settings = await this.notificationsSettingsRepository.findOne({ where: { userId } });
		if (!settings) await this.notificationsSettingsRepository.insert({ userId, ...payload });
		else {
			await this.notificationsSettingsRepository.update({ userId }, payload);
		}

		return this.notificationsSettingsRepository.findOne({ where: { userId } });
	}
}
