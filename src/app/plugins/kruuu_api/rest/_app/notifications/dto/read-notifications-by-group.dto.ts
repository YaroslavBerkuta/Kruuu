import { NotificationsGroup } from '~api/domain/notifications/typing/enums';
import { DtoProperty } from '~api/shared';

export class ReadNotificationsByGroupDto {
	@DtoProperty({
		enum: NotificationsGroup,
	})
	group: NotificationsGroup;
}
