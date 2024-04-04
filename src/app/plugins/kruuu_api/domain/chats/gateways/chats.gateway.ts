import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import * as _ from 'lodash';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { Events } from '~api/shared';
import { ChatsAccessoryService } from '../services/chats-accessory.service';

@Injectable()
@WebSocketGateway({
	namespace: '/',
})
export class ChatsGateway {
	constructor(
		private readonly eventEmitter: EventEmitter2,
		@Inject(REAL_TIME_SERVICE) private wsService: WSService,
		private readonly chatsAccessoryService: ChatsAccessoryService,
	) {}

	@SubscribeMessage('chat/read-message')
	async onReadMessage(
		@MessageBody() data: { userId: number; messagesIds: number[]; chatId: number },
	): Promise<void> {
		if (data.userId && !_.isEmpty(data.messagesIds)) {
			this.eventEmitter.emit(Events.OnChatMessageView, {
				userId: data.userId,
				messageIds: data.messagesIds,
			});

			await this.emitEventToChat(data.chatId, data.userId, 'chat/is-read');
		}
	}

	@SubscribeMessage('chat/read-chat')
	async onReadChat(@MessageBody() data: { userId: number; chatsIds: number[] }): Promise<void> {
		if (data.userId && !_.isEmpty(data.chatsIds)) {
			for (const chatId of data.chatsIds) {
				this.eventEmitter.emit(Events.OnReadChat, {
					userId: data.userId,
					chatId,
				});

				await this.emitEventToChat(chatId, data.userId, 'chat/is-read', true);
			}
		}
	}

	private async emitEventToChat(chatId: number, userId: number, key: string, sendToUser?: boolean) {
		const chatUsersIds = await this.chatsAccessoryService.getChatUsersIds(chatId);

		const receiverIds = sendToUser ? [...chatUsersIds] : chatUsersIds.filter(it => it !== userId);

		receiverIds.map(it =>
			this.wsService.emitToUser(it, key, {
				chatId,
				userId,
			}),
		);
	}
}
