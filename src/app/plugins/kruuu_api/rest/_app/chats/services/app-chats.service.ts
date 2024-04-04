import { Inject, Injectable } from '@nestjs/common';
import {
	CHATS_MEMBERS_REPOSITORY,
	CHATS_MEMBERS_SERVICE,
	CHATS_MESSAGES_REPOSITORY,
	CHATS_SERVICE,
	GET_CHATS_LIST_ACTION,
	IChatMember,
	IChatsMembersRepository,
	IChatsMessagesRepository,
	IChatsService,
	IGetChatsListAction,
	IMembersService,
} from '~api/domain/chats/typing';
import { CreateChatPayloadDto } from '../dto';
import * as _ from 'lodash';
import { IPagination } from '~api/shared';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
@Injectable()
export class AppChatsService {
	@Inject(CHATS_SERVICE) private readonly chatsService: IChatsService;
	@Inject(CHATS_MEMBERS_REPOSITORY) private readonly membersRepository: IChatsMembersRepository;
	@Inject(CHATS_MESSAGES_REPOSITORY)
	private readonly messagesRepository: IChatsMessagesRepository;
	@Inject(CHATS_MEMBERS_SERVICE)
	private readonly chatsMembersService: IMembersService;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;
	@Inject(GET_CHATS_LIST_ACTION) private getChatsListAction: IGetChatsListAction;

	public async storeChat(userId: number, dto: CreateChatPayloadDto) {
		const existedChat = await this.chatsService.findChatBetweenUsers(userId, dto.userId);

		if (!existedChat) {
			const newChatId = await this.chatsService.create([userId, dto.userId]);
			if (dto.message)
				await this.messagesRepository.save({
					userId,
					chatId: newChatId,
					content: dto.message,
				});

			return newChatId;
		} else {
			await this.restoreMemberIfDeleted(userId, existedChat.chatMembers);
			return existedChat.id;
		}
	}

	public async getUserChats(userId: number, pagination: IPagination) {
		return this.getChatsListAction.run(userId, pagination);
	}

	public async getChat(chatId: number, userId: number) {
		return this.chatsService.getChat(chatId, userId);
	}

	public async deleteChat(chatId: number) {
		const chatMembers = await this.membersRepository.findBy({ chatId });
		const chatUsersIds = chatMembers.map(it => it.userId);
		await this.chatsService.delete(chatId);
		await this.messagesRepository.delete({ chatId });
		await this.membersRepository.delete({ chatId });

		chatUsersIds.map(it => this.wsService.emitToUser(it, 'chat/delete-chat', { chatId }));
	}

	public async findChatBetweenUsers(userId1: number, userId2: number) {
		const chat = await this.chatsService.findChatBetweenUsers(userId1, userId2);
		if (chat) return chat.id;

		return null;
	}

	private async restoreMemberIfDeleted(userId: number, members: IChatMember[]) {
		const member = _.find(members, member => member.userId === userId);
		if (!member.isDeleted) return;
		await this.chatsMembersService.restoreMember(member.id);
	}
}
