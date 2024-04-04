import { PushNotificationsServiceType } from '../interfaces';
import { OneSignalService } from './one-signal.service';

export { OneSignalService };

const services = {
	'one-signal': OneSignalService,
};

export const getPushNotificationsService = (key: PushNotificationsServiceType) => {
	return services[key] || OneSignalService;
};
