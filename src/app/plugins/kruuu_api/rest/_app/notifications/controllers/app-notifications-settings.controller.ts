import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ReqUser } from '~api/shared';
import { SaveAppNotificationsSettingsDto } from '../dto';
import { AppNotificationsSettingsService } from '../services';
import { NotificationsSettingsDto } from '~api/domain/notifications/dto/notifications.dto';

@ApiTags('App | Notifications')
@Controller('app/notifications-settings')
export class AppNotificationsSettingsController {
	constructor(private appNotificationsSettingsService: AppNotificationsSettingsService) {}

	@ApiOperation({
		summary: 'Getting the users notification preferences',
	})
	@ApiOkResponse({
		description:
			'Returns the users notification settings. If they are not yet in the database, it is created first',
		type: NotificationsSettingsDto,
	})
	@AuthGuard()
	@Get()
	get(@ReqUser() userId: number) {
		return this.appNotificationsSettingsService.getUserSettings(userId);
	}

	@ApiOperation({
		summary: 'Changing user notification settings in the mobile application',
	})
	@ApiOkResponse({
		description: 'Returns the users modified settings in the mobile application',
		type: NotificationsSettingsDto,
	})
	@AuthGuard()
	@Put()
	save(@ReqUser() userId: number, @Body() dto: SaveAppNotificationsSettingsDto) {
		return this.appNotificationsSettingsService.update(userId, dto);
	}
}
