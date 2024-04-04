import { Injectable, Inject } from '@nestjs/common';
import { PUSH_NOTIFICATIONS_OPTIONS } from '../consts';
import { IPushNotifcationsModuleParams, IPushNotificationsService } from '../interfaces';
import {
	INewNotificationToUsers,
	IPushNotificationsUser,
} from '../interfaces/push-notifications.interfaces';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OneSignalService implements IPushNotificationsService {
	private baseUrl = 'https://onesignal.com/api/v1/';

	constructor(
		private httpService: HttpService,
		@Inject(PUSH_NOTIFICATIONS_OPTIONS)
		private readonly options: IPushNotifcationsModuleParams,
	) {}

	private getOneSignalParams() {
		return this.options;
	}

	private sendHttpRequest(method: 'get' | 'post', url: string, data: any = {}) {
		const oneSignalParams = this.getOneSignalParams();

		if (method === 'get') {
			return this.httpService
				.get(url, {
					params: {
						app_id: oneSignalParams.appId,
						...data,
					},
					headers: {
						Authorization: 'Basic ' + oneSignalParams.restApiKey,
					},
				})
				.toPromise();
		}
		if (method === 'post') {
			data.app_id = oneSignalParams.appId;
			return this.httpService
				.post(url, data, {
					headers: {
						Authorization: 'Basic ' + oneSignalParams.restApiKey,
					},
				})
				.toPromise();
		}

		return null;
	}

	public async getUserInfo(pushNotificationsUserId: string): Promise<IPushNotificationsUser> {
		try {
			const response = await this.sendHttpRequest(
				'get',
				`${this.baseUrl}/players/${pushNotificationsUserId}`,
			);

			return response.data as IPushNotificationsUser;
		} catch (e) {
			return null;
		}
	}

	public async createNotification(data: INewNotificationToUsers): Promise<void> {
		try {
			if (!data.include_player_ids || !data.include_player_ids.length) return;
			await this.sendHttpRequest('post', `${this.baseUrl}/notifications`, data);
		} catch (e: any) {
			console.log('One signal error when send notification', e.response);
		}
	}
}
