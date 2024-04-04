import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
	CHATS_MEMBERS_SERVICE,
	CHATS_MESSAGES_SERVICE,
	IMembersService,
	IMessagesService,
} from '~api/domain/chats/typing';
import { Events, IPagination } from '~api/shared';
import { SendMessagePayloadDto } from '../dto';
import * as _ from 'lodash';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';

@Injectable()
export class AppChatsMessagesService {
	@Inject(CHATS_MESSAGES_SERVICE)
	private readonly chatsMessagesService: IMessagesService;
	@Inject(CHATS_MEMBERS_SERVICE)
	private readonly chatsMembersService: IMembersService;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;

	constructor(private readonly eventEmitter: EventEmitter2) {}

	public async sendMessageToChat(userId: number, dto: SendMessagePayloadDto) {
		return this.chatsMessagesService.sendMessage(userId, dto);
	}

	public async getChatMessages(chatId: number, userId: number, pagination: IPagination) {
		const { items, count } = await this.chatsMessagesService.getChatMessages(chatId, pagination);

		if (!_.isEmpty(items)) {
			this.eventEmitter.emit(Events.OnReadChat, {
				userId,
				chatId,
			});
		}

		const chatUsersIds = await this.chatsMembersService.getChatUsersIds(chatId);

		chatUsersIds.map(it => {
			this.wsService.emitToUser(it, 'chat/is-read', {
				chatId,
				userId,
			});
		});

		return { items, count };
	}

	public async deleteMessage(messageId: number) {
		return this.chatsMessagesService.deleteMessage(messageId);
	}

	public async getUnreadCount(userId: number) {
		return this.chatsMessagesService.getUnreadMessagesCount(userId);
	}
}
