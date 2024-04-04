import { Inject, Injectable } from '@nestjs/common';
import { IPagination, paginateAndGetMany } from '~api/shared';
import {
	CHATS_MESSAGES_REPOSITORY,
	IChatsMessagesRepository,
	IMessagesService,
	ISaveMessagePayload,
} from '../typing';
import { ChatsAccessoryService } from './chats-accessory.service';
import * as _ from 'lodash';

@Injectable()
export class ChatsMessagesService implements IMessagesService {
	@Inject(CHATS_MESSAGES_REPOSITORY)
	private readonly chatsMessagesRepository: IChatsMessagesRepository;

	constructor(private readonly chatsAccessoryService: ChatsAccessoryService) {}

	public async getChatMessages(chatId: number, pagination?: IPagination) {
		const query = this.chatsMessagesRepository
			.createQueryBuilder('it')
			.andWhere('it.chatId = :chatId', { chatId: chatId })
			.orderBy('it.createdAt', 'DESC');

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');
		return { items, count };
	}

	public async sendMessage(userId: number, payload: ISaveMessagePayload) {
		const message = await this.chatsMessagesRepository.save({
			userId,
			chatId: payload.chatId,
			content: payload.message,
		});

		await this.chatsAccessoryService.afterSendMessage(payload.chatId, message);

		return message;
	}

	public async deleteMessage(messageId: number) {
		const message = await this.chatsMessagesRepository.findOneBy({ id: messageId });
		await this.chatsMessagesRepository.delete(messageId);

		await this.chatsAccessoryService.emitEventToChat(message.chatId, 'chat/delete-message', {
			messageId: message.id,
			chatId: message.chatId,
		});
	}

	public async getUnreadMessagesCount(userId: number) {
		const members = await this.chatsAccessoryService.getMembersByUserId(userId);
		const chatIds = members.map(it => it.chatId);

		const messages = await this.chatsMessagesRepository
			.createQueryBuilder('it')
			.where('it.chatId = ANY(:chatIds)', { chatIds })
			.andWhere('it.userId != :userId', { userId })
			.andWhere('it.isRead = :isRead', { isRead: false })
			.getMany();

		const messagesFilteredByDate = _.filter(messages, message => {
			const chatMember = _.find(members, member => member.chatId === message.chatId);
			if (chatMember.addedAt && message.createdAt < chatMember.addedAt) return false;
			return true;
		});

		return {
			count: messagesFilteredByDate.length,
		};
	}
}
