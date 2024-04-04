import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatDetailsDto, ChatsListDto } from '~api/domain/chats/typing';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { CreateChatPayloadDto } from '../dto';
import { AppChatsService } from '../services';

@ApiTags('App | Chats')
@Controller('app/chats')
export class AppChatsController {
	constructor(private readonly chatsService: AppChatsService) {}

	/*************************************************************************************** */

	@ApiOperation({ summary: 'Create new chat' })
	@ApiBody({ type: CreateChatPayloadDto })
	@ApiResponse({
		status: 201,
		type: Number,
		description: 'Create new chat and return id',
	})
	@AuthGuard()
	@Post()
	public async createChat(@Body() dto: CreateChatPayloadDto, @ReqUser() userId: number) {
		return await this.chatsService.storeChat(userId, dto);
	}

	/*************************************************************************************** */

	@ApiOperation({
		summary: 'Get chats list',
	})
	@ApiOkResponse({
		description: 'Return user chats list',
		type: ChatsListDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get()
	public async getUserChats(@ReqUser() userId: number, @ReqPagination() pagination: IPagination) {
		return this.chatsService.getUserChats(userId, pagination);
	}

	/*************************************************************************************** */

	@ApiOperation({
		summary: 'Get chat details',
	})
	@ApiOkResponse({
		description: 'Return chat details',
		type: ChatDetailsDto,
	})
	@AuthGuard()
	@Get(':chatId')
	public async getChat(@ReqUser() userId: number, @Param('chatId') chatId: number) {
		return this.chatsService.getChat(chatId, userId);
	}

	/*************************************************************************************** */

	@ApiOperation({ summary: 'Delete chat' })
	@ApiOkResponse({ description: 'Delete chat with members and messages' })
	@AuthGuard()
	@Delete(':chatId')
	public async deleteChat(@Param('chatId') chatId: number) {
		return await this.chatsService.deleteChat(chatId);
	}

	/*************************************************************************************** */

	@ApiOperation({
		summary: 'Get chat with user',
	})
	@ApiOkResponse({
		description: 'Return chat id if chat exists',
		type: Number,
	})
	@AuthGuard()
	@Get('/with-user/:userId')
	public async findChatWithUser(@ReqUser() userId1: number, @Param('userId') userId2: number) {
		return this.chatsService.findChatBetweenUsers(userId1, userId2);
	}
}
