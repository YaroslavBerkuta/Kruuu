import { IUser } from '~api/domain/users/typing';
import { ApplicationType } from '~api/shared';

export interface INotificationUserDevice {
	id: number;
	notificationUserId: string;
	deviceUuid: string;
	applicationType: ApplicationType;
	userId: number;

	user?: IUser;

	createDate?: string;
}
