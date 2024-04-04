import { IUser } from '~api/domain/users/typing';
import { NotificationsGroup } from '../enums';

export interface INotification {
	id: number;
	title: string;
	content: string;
	group: NotificationsGroup;
	isRead: boolean;
	userId: number;
	user?: IUser;
	createAt: string;
	imageUrl?: string;
	data?: Record<string, string>;
}
