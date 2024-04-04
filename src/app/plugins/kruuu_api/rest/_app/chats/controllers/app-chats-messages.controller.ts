import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatMessagesListDto } from '~api/domain/chats/typing';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { GetChatMessagesParamsDto, SendMessagePayloadDto, UnreadMessagesCountDto } from '../dto';
import { AppChatsMessagesService } from '../services';

@ApiTags('App | Chats messages')
@Controller('app/chats-messages')
export class AppChatsMessagesController {
	constructor(private readonly chatsMessagesService: AppChatsMessagesService) {}

	/*************************************************************************************** */

	@ApiOperation({ summary: 'Send message' })
	@ApiBody({ type: SendMessagePayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Send new message to chat',
	})
	@AuthGuard()
	@Post()
	public async sendMessage(@Body() dto: SendMessagePayloadDto, @ReqUser() userId: number) {
		return await this.chatsMessagesService.sendMessageToChat(userId, dto);
	}

	/*************************************************************************************** */

	@ApiOperation({
		summary: 'Get chat messages',
	})
	@ApiOkResponse({
		description: 'Return chat messages list with count',
		type: ChatMessagesListDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get()
	public async getChatMessages(
		@ReqUser() userId: number,
		@Query() params: GetChatMessagesParamsDto,
		@ReqPagination() pagination: IPagination,
	) {
		return this.chatsMessagesService.getChatMessages(params.chatId, userId, pagination);
	}

	/*************************************************************************************** */

	@ApiOperation({ summary: 'Delete message' })
	@ApiOkResponse({ description: 'Delete message' })
	@AuthGuard()
	@Delete(':messageId')
	public async deleteMessage(@Param('messageId') messageId: number) {
		return await this.chatsMessagesService.deleteMessage(messageId);
	}

	/*************************************************************************************** */

	@ApiOperation({ summary: 'Get unread messages count' })
	@ApiOkResponse({
		description: 'Return unread messages count in all chats',
		type: UnreadMessagesCountDto,
	})
	@AuthGuard()
	@Get('unread-count')
	public async getUnreadTasksCount(@ReqUser() userId: number) {
		return this.chatsMessagesService.getUnreadCount(userId);
	}
}
