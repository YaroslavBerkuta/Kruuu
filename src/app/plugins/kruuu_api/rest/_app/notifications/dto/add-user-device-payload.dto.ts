import { DtoProperty } from '~api/shared';

export class AddUserDevicePayloadDto {
	@DtoProperty()
	deviceUuid: string;

	@DtoProperty()
	notificationUserId: string;
}
