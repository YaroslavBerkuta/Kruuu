import { DtoPropertyOptional } from '~api/shared';

export class SaveAppNotificationsSettingsDto {
	@DtoPropertyOptional()
	appEnabled?: boolean;
}
