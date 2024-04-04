import { DtoProperty } from '~api/shared';

export class NotificationDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	data?: Record<string, string>;

	@DtoProperty()
	title: string;

	@DtoProperty()
	content: string;

	@DtoProperty()
	isRead: boolean;

	@DtoProperty()
	imageUrl?: string;

	@DtoProperty()
	userId: number;

	@DtoProperty()
	createDate: string;
}

export class PaginatedNotificationsDto {
	@DtoProperty({ type: [NotificationDto] })
	items: NotificationDto[];

	@DtoProperty()
	count: number;
}

export class NotificationsSettingsDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	userId: number;

	@DtoProperty()
	appEnabled: boolean;

	@DtoProperty()
	webEnabled: boolean;

	@DtoProperty()
	createDate: string;

	@DtoProperty()
	updateDate: string;
}
