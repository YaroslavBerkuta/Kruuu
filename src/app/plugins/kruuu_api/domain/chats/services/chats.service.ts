import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHATS_REPOSITORY, IChatsRepository, IChatsService } from '../typing';
import * as _ from 'lodash';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { ChatsAccessoryService } from './chats-accessory.service';

@Injectable()
export class ChatsService implements IChatsService {
	@Inject(CHATS_REPOSITORY) private readonly chatsRepository: IChatsRepository;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;

	constructor(private readonly chatsAccessoryService: ChatsAccessoryService) {}

	public async create(usersIds: number[]) {
		if (usersIds[0] === usersIds[1])
			throw new BadRequestException("Can't create chat with this user");

		const chat = await this.chatsRepository.save({});

		await this.chatsAccessoryService.saveChatMembers(chat.id, usersIds);

		usersIds.map(it => this.wsService.emitToUser(it, 'chat/new-chat'));
		return chat.id;
	}

	public async delete(chatId: number) {
		await this.chatsRepository.delete({ id: chatId });
	}

	public async getChat(chatId: number, userId: number) {
		const chat = await this.chatsRepository.findOneBy({ id: chatId });
		if (!chat) throw new NotFoundException('Chat not found');

		return this.chatsAccessoryService.prepareChat(chat, userId);
	}

	public async findChatBetweenUsers(userId1: number, userId2: number) {
		return this.chatsAccessoryService.getChatBetweenUsers(userId1, userId2);
	}

	public async findUsersChatId(userId1: number, userId2: number, mustBeActiveUserId?: number) {
		const chat = await this.chatsAccessoryService.getChatBetweenUsers(
			userId1,
			userId2,
			mustBeActiveUserId,
		);

		if (!chat) return null;
		return chat.id;
	}
}
