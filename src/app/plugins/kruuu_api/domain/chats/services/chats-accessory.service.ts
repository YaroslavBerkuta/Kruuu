import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EMPLOYERS_INFO_SERVICE, IEmployersService } from '~api/domain/employer/typing';
import { ITalentsService, TALENTS_INFO_SERVICE } from '~api/domain/talents/typing';
import { IUsersService, UserRole, USERS_SERVICE } from '~api/domain/users/typing';
import {
	ChatEventKeys,
	CHATS_MEMBERS_REPOSITORY,
	CHATS_MESSAGES_REPOSITORY,
	CHATS_REPOSITORY,
	IChat,
	IChatMessage,
	IChatsMembersRepository,
	IChatsMessagesRepository,
	IChatsRepository,
} from '../typing';
import * as _ from 'lodash';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import { Events } from '~api/shared';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatsAccessoryService {
	@Inject(CHATS_REPOSITORY) private readonly chatsRepository: IChatsRepository;
	@Inject(CHATS_MEMBERS_REPOSITORY)
	private readonly chatsMembersRepository: IChatsMembersRepository;
	@Inject(CHATS_MESSAGES_REPOSITORY)
	private readonly chatsMessagesRepository: IChatsMessagesRepository;
	@Inject(USERS_SERVICE) private readonly usersService: IUsersService;
	@Inject(TALENTS_INFO_SERVICE) private readonly talentsService: ITalentsService;
	@Inject(EMPLOYERS_INFO_SERVICE) private readonly employersService: IEmployersService;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;
	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;

	constructor(private eventEmitter: EventEmitter2) {}

	public async saveChatMembers(chatId: number, usersIds: number[]) {
		await Promise.all(
			usersIds.map(async it => {
				const existUser = await this.usersService.getOneBy({ id: it });
				if (!existUser) throw new BadRequestException('No users found with this id');
			}),
		);

		const membersToSave = usersIds.map(it => ({ chatId, userId: it }));
		await this.chatsMembersRepository.save(membersToSave);
	}

	public async afterSendMessage(chatId: number, message: IChatMessage) {
		await this.chatsRepository.update(chatId, { lastMessageDate: message.createdAt });

		await this.restoreMembersIfDeleted(chatId);

		const data: Record<string, any> = { message };

		await this.emitEventToChat(chatId, 'chat/new-message', data);

		await this.pushNotificationToChatMembers(Events.OnNewMessage, chatId, message.userId);
	}

	public async restoreMembersIfDeleted(chatId: number) {
		const members = await this.chatsMembersRepository
			.createQueryBuilder('it')
			.where('it.chatId = :chatId', { chatId })
			.getMany();

		await Promise.all(
			members.map(async it => {
				if (!it.isDeleted) return;

				await this.chatsMembersRepository.update(Number(it.id), {
					isDeleted: false,
					addedAt: new Date().toString(),
				});
				this.wsService.emitToUser(it.userId, 'chat/new-chat');
			}),
		);
	}

	public async getMembersByUserId(userId: number) {
		return this.chatsMembersRepository
			.createQueryBuilder('it')
			.where('it.userId = :userId', { userId })
			.andWhere('it.isDeleted = :isDeleted', { isDeleted: false })
			.getMany();
	}

	public async getChatBetweenUsers(
		userId: number,
		targetUserId: number,
		mustBeActiveUserId?: number,
	) {
		const chats = await this.chatsRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.chatMembers', 'member', 'member.userId = ANY(:userIds)', {
				userIds: [userId, targetUserId],
			})
			.getMany();

		const chatBetweenUsers = _.find(chats, chat => {
			if (chat.chatMembers.length !== 2) return false;

			const chatUsersIds = chat.chatMembers.map(it => it.userId);
			let isUserActive = true;

			if (mustBeActiveUserId) {
				const mustBeActiveMember = _.find(
					chat.chatMembers,
					member => member.userId === mustBeActiveUserId,
				);
				isUserActive = !mustBeActiveMember.isDeleted;
			}

			return (
				isUserActive && _.includes(chatUsersIds, userId) && _.includes(chatUsersIds, targetUserId)
			);
		});
		return chatBetweenUsers;
	}

	public async prepareChat(chat: IChat, userId: number) {
		chat.lastMessage = await this.getLastMessage(chat.id);
		const firstMessage = await this.getFirstMessage(chat.id);
		chat.firstMessageId = firstMessage ? firstMessage.id : null;
		chat.lastMessageId = chat.lastMessage ? chat.lastMessage.id : null;
		chat.unreadMessagesCount = await this.getUnreadMessagesCount(userId, chat.id);

		const otherMember = await this.chatsMembersRepository
			.createQueryBuilder('it')
			.where('it.chatId = :chatId', { chatId: chat.id })
			.andWhere('it.userId != :userId', { userId })
			.andWhere('it.isDeleted != :isDeleted', { isDeleted: true })
			.getOne();

		if (!otherMember) return chat;
		const user = await this.usersService.getOneBy({ id: otherMember.userId });
		let userInfo;

		if (user.role === UserRole.Employer)
			userInfo = await this.employersService.getOneBy({ userId: user.id });
		else userInfo = await this.talentsService.getOneBy({ userId: user.id });

		const isOnline = this.wsService.isUserOnline(user.id);

		const gallery = await this.galleryService.get({
			parentId: otherMember.userId,
			parentTable: user.role === UserRole.Talent ? 'talents' : 'employers',
		});
		chat.otherMember = {
			...otherMember,
			isOnline,
			user: {
				userId: user.id,
				role: user.role,
				name: userInfo ? userInfo.name : '',
				avatarUrl: !_.isEmpty(gallery) ? gallery[0].fileUrl : null,
			},
		};

		return chat;
	}

	public async emitEventToChat(chatId: number, key: ChatEventKeys, data?: any) {
		const usersIds = await this.getChatUsersIds(chatId);

		usersIds.map(it => this.wsService.emitToUser(it, key, data));
	}

	public async getChatUsersIds(chatId: number) {
		const members = await this.chatsMembersRepository
			.createQueryBuilder('it')
			.select('it.userId')
			.where('it.chatId = :chatId', { chatId })
			.andWhere('it.isDeleted = :isDeleted', { isDeleted: false })
			.getMany();

		return members.map(it => it.userId);
	}

	public async getChatUnreadMessages(userId: number, chatId: number) {
		return this.chatsMessagesRepository
			.createQueryBuilder('it')
			.where('it.chatId = :chatId', { chatId })
			.andWhere('it.userId != :userId', { userId })
			.andWhere('it.isRead = :isRead', { isRead: false })
			.getMany();
	}

	private async getLastMessage(chatId: number) {
		return this.chatsMessagesRepository
			.createQueryBuilder('it')
			.andWhere('it.chatId = :chatId', { chatId })
			.orderBy('it.createdAt', 'DESC')
			.getOne();
	}

	private async getFirstMessage(chatId: number) {
		return this.chatsMessagesRepository
			.createQueryBuilder('it')
			.andWhere('it.chatId = :chatId', { chatId })
			.orderBy('it.createdAt', 'ASC')
			.getOne();
	}

	private async getUnreadMessagesCount(userId: number, chatId: number) {
		return this.chatsMessagesRepository
			.createQueryBuilder('it')
			.where('it.chatId = :chatId', { chatId })
			.andWhere('it.userId != :userId', { userId })
			.andWhere('it.isRead = :isRead', { isRead: false })
			.getCount();
	}

	public async pushNotificationToChatMembers(event: Events, chatId: number, authorId: number) {
		const chatMembers = await this.chatsMembersRepository
			.createQueryBuilder('it')
			.where('it.chatId = :chatId', { chatId })
			.andWhere('it.isDeleted = :isDeleted', { isDeleted: false })
			.getMany();

		const targetUser = chatMembers.filter(member => member.userId !== authorId);

		this.eventEmitter.emit(event, {
			authorId,
			targetUser,
			chatId,
		});
	}
}
