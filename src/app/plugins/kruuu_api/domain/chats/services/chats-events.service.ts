import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatsAccessoryService } from './chats-accessory.service';
import { Events, IEventsPayloads } from '~api/shared';
import { CHATS_MESSAGES_REPOSITORY, IChatsMessagesRepository } from '../typing';
import { In } from 'typeorm';

@Injectable()
export class ChatsEventsService {
	@Inject(CHATS_MESSAGES_REPOSITORY)
	private readonly chatsMessagesRepository: IChatsMessagesRepository;
	constructor(private readonly chatsAccessoryService: ChatsAccessoryService) {}

	@OnEvent(Events.OnChatMessageView)
	public async onChatMessageView(payload: IEventsPayloads['OnChatMessageView']) {
		await this.chatsMessagesRepository.update({ id: In(payload.messageIds) }, { isRead: true });
	}

	@OnEvent(Events.OnReadChat)
	public async onReadChat(payload: IEventsPayloads['OnReadChat']) {
		const unreadMessages = await this.chatsAccessoryService.getChatUnreadMessages(
			payload.userId,
			payload.chatId,
		);

		if (_.isEmpty(unreadMessages)) return;

		const messagesIds = unreadMessages.map(it => it.id);

		await this.chatsMessagesRepository.update({ id: In(messagesIds) }, { isRead: true });
	}
}
