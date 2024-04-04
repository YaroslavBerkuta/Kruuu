import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { Events } from '~api/shared';
import { CHATS_MEMBERS_REPOSITORY, IChatsMembersRepository, IMembersService } from '../typing';
import { ChatsAccessoryService } from './chats-accessory.service';

@Injectable()
export class ChatsMembersService implements IMembersService {
	@Inject(CHATS_MEMBERS_REPOSITORY)
	private readonly chatsMembersRepository: IChatsMembersRepository;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;

	constructor(
		private eventEmitter: EventEmitter2,
		private chatsAccessoryService: ChatsAccessoryService,
	) {}

	public async deleteMember(memberId: number): Promise<void> {
		const chatMember = await this.chatsMembersRepository.findOneBy({ id: memberId });
		await this.chatsMembersRepository.update(Number(memberId), {
			isDeleted: true,
		});

		try {
			this.eventEmitter.emit(Events.OnReadChat, {
				userId: chatMember.userId,
				chatId: chatMember.chatId,
			});
		} catch (e) {
			console.log('Error send events after delete member');
		}
	}

	public async restoreMember(memberId: number) {
		const chatMember = await this.chatsMembersRepository.findOneBy({ id: memberId });

		if (!chatMember.isDeleted) return;
		await this.chatsMembersRepository.update(Number(memberId), {
			isDeleted: false,
			addedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
		});
		this.wsService.emitToUser(chatMember.userId, 'chat/new-chat');
	}

	public async getChatUsersIds(chatId: number) {
		return this.chatsAccessoryService.getChatUsersIds(chatId);
	}
}
