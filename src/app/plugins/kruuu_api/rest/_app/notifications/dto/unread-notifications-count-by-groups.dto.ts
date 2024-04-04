import { DtoProperty } from '~api/shared';

export class UnreadNotificationsCountByGroupDto {
	@DtoProperty()
	chats: number;

	@DtoProperty()
	other: number;
}
