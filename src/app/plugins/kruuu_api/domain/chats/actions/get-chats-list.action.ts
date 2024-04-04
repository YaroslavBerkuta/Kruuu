import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import {
	EMPLOYERS_INFO_SERVICE,
	IEmployerInfo,
	IEmployersService,
} from '~api/domain/employer/typing';
import { ITalentInfo, ITalentsService, TALENTS_INFO_SERVICE } from '~api/domain/talents/typing';
import { IUsersService, UserRole, USERS_SERVICE } from '~api/domain/users/typing';
import { Action, IPagination, paginateAndGetMany } from '~api/shared';
import { SelectQueryBuilder } from 'typeorm';
import { ChatsAccessoryService } from '../services/chats-accessory.service';
import {
	CHATS_MEMBERS_REPOSITORY,
	CHATS_REPOSITORY,
	IChat,
	IChatsMembersRepository,
	IChatsRepository,
	IGetChatsListAction,
} from '../typing';

@Injectable()
export class GetChatsListAction extends Action implements IGetChatsListAction {
	@Inject(CHATS_REPOSITORY) private readonly chatsRepository: IChatsRepository;
	@Inject(CHATS_MEMBERS_REPOSITORY)
	private readonly chatsMembersRepository: IChatsMembersRepository;
	@Inject(TALENTS_INFO_SERVICE) private readonly talentsService: ITalentsService;
	@Inject(EMPLOYERS_INFO_SERVICE) private readonly employersService: IEmployersService;
	@Inject(USERS_SERVICE) private readonly usersService: IUsersService;

	constructor(private readonly chatsAccessoryService: ChatsAccessoryService) {
		super();
	}

	public async run(userId: number, pagination: Readonly<IPagination>) {
		try {
			const chatsIds = await this.getChatsIdsByUserId(userId);

			const query = this.chatsRepository
				.createQueryBuilder('it')
				.where('it.id = ANY(:chatsIds)', { chatsIds })
				.orderBy('it.lastMessageDate', 'DESC');

			await this.addSearchStringToQuery(query, userId, pagination.searchString, chatsIds);

			const { items, count } = await paginateAndGetMany(query, pagination, 'it');

			await this.fillAndTransformChatsList(items, userId);

			return { items, count };
		} catch (e) {
			console.log('Error get list', e);
		}
		return null;
	}

	private async getChatsIdsByUserId(userId: number) {
		const members = await this.chatsMembersRepository
			.createQueryBuilder('it')
			.where('it.userId = :userId', { userId })
			.andWhere('it.isDeleted = :isDeleted', { isDeleted: false })
			.getMany();

		return members.map(it => it.chatId);
	}

	private async getOtherChatsMembers(userId: number, chatIds: number[]) {
		return (
			this.chatsMembersRepository
				.createQueryBuilder('it')
				.where('it.chatId IN (:...chatIds)', { chatIds })
				.andWhere('it.userId != :userId', { userId })
				// .andWhere('it.isDeleted = :isDeleted', { isDeleted: false })
				.getMany()
		);
	}

	private async addSearchStringToQuery(
		query: SelectQueryBuilder<IChat>,
		userId: number,
		searchString: string,
		userChatIds: number[],
	) {
		if (searchString) {
			const chatIds = await this.getChatsIdsBySearchString(userId, searchString, userChatIds);

			query.andWhere('it.id = ANY(:chatIds)', { chatIds });
		}
	}

	private async getChatsIdsBySearchString(
		userId: number,
		searchString: string,
		userChatIds: number[],
	) {
		if (_.isEmpty(userChatIds)) return [];

		const user = await this.usersService.getOneBy({ id: userId });
		const otherMembers = await this.getOtherChatsMembers(userId, userChatIds);
		const otherMembersUserIds = otherMembers.map(it => it.userId);

		let usersBySearchString: (ITalentInfo | IEmployerInfo)[];
		if (user.role === UserRole.Talent)
			usersBySearchString = await this.employersService.getBySearchString(
				searchString,
				otherMembersUserIds,
			);
		else
			usersBySearchString = await this.talentsService.getBySearchString(
				searchString,
				otherMembersUserIds,
			);

		if (_.isEmpty(usersBySearchString)) return [];

		const userIds = usersBySearchString.map(it => it.userId);
		const membersByUserIds = otherMembers.filter(it => _.includes(userIds, it.userId));

		return membersByUserIds.map(it => it.chatId);
	}

	private async fillAndTransformChatsList(chats: IChat[], userId: number) {
		await Promise.all(
			chats.map(async chat => await this.chatsAccessoryService.prepareChat(chat, userId)),
		);
	}
}
