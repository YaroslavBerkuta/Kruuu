import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import {
	AddUserDevicePayloadDto,
	ReadNotificationsByGroupDto,
	ReadNotificationsByIdsDto,
	UnreadNotificationsCountByGroupDto,
} from '../dto';
import { AppNotificationsService } from '../services';
import { PaginatedNotificationsDto } from '~api/domain/notifications/dto/notifications.dto';

@ApiTags('App | Notifications')
@Controller('app/notifications')
export class AppNotificationsController {
	constructor(private readonly appNotificationsService: AppNotificationsService) {}

	@ApiOperation({ summary: 'Notification list' })
	@ApiOkResponse({
		description: 'List and number of notifications',
		type: PaginatedNotificationsDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get()
	public async getAll(@ReqUser() userId: number, @ReqPagination() pagination: IPagination) {
		return await this.appNotificationsService.getList(userId, pagination);
	}

	@ApiOperation({ summary: 'Number of unread notifications by group' })
	@ApiOkResponse({
		description: 'Number of unread notifications for each group',
		type: UnreadNotificationsCountByGroupDto,
	})
	@AuthGuard()
	@Get('unread-count')
	public async getUnreadCount(@ReqUser() userId: number) {
		return await this.appNotificationsService.getUnreadCountByGroups(userId);
	}

	@ApiOperation({ summary: 'Saving the users device' })
	@ApiResponse({ status: 201 })
	@AuthGuard()
	@Post('device')
	public async addUserDevice(@ReqUser() userId: number, @Body() dto: AddUserDevicePayloadDto) {
		await this.appNotificationsService.addDevice(userId, dto);
	}

	@ApiOperation({ summary: 'Mark all unread user notifications as read' })
	@ApiOkResponse()
	@AuthGuard()
	@Put('read')
	public async readAllNotifications(@ReqUser() userId: number) {
		await this.appNotificationsService.readAllUserNotifications(userId);
	}

	@ApiOperation({
		summary: 'Mark as read all unread user notifications belonging to this group',
	})
	@ApiOkResponse()
	@AuthGuard()
	@Put('read-by-group')
	public async readNotificationsByGroup(
		@ReqUser() userId: number,
		@Body() dto: ReadNotificationsByGroupDto,
	) {
		await this.appNotificationsService.readNotificationsByGroup(userId, dto);
	}

	@ApiOperation({
		summary: 'Mark notifications as read by their ID',
	})
	@ApiOkResponse()
	@AuthGuard()
	@Put('read-by-ids')
	public async readNotificationsByIds(
		@ReqUser() userId: number,
		@Body() dto: ReadNotificationsByIdsDto,
	) {
		await this.appNotificationsService.readNotificationsByIds(userId, dto);
	}
}
