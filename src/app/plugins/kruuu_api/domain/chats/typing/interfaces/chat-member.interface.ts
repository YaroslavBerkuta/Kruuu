import { IUserShortInfo } from '~api/domain/users/typing';

export interface IChatMember {
	id: number;
	chatId: number;
	userId: number;
	isDeleted: boolean;
	user?: IUserShortInfo;
	isOnline?: boolean;
	addedAt: string;
	createdAt: string;
}
