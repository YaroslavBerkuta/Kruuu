import { IPagination, IPaginationResult } from '~api/shared';
import { IChatMessage } from './chat-message.interface';
import { IChat } from './chat.interface';

export interface ISaveMessagePayload {
	message: string;
	chatId: number;
}

export interface IChatsService {
	create(userIds: number[]): Promise<number>;
	delete(chatId: number): Promise<void>;
	getChat(chatId: number, userId: number): Promise<IChat>;
	findChatBetweenUsers(userId1: number, userId2: number): Promise<IChat>;
	findUsersChatId(userId1: number, userId2: number, mustBeActiveUserId?: number): Promise<number>;
}

export interface IMembersService {
	deleteMember(memberId: number): Promise<void>;
	restoreMember(memberId: number): Promise<void>;
	getChatUsersIds(chatId: number): Promise<number[]>;
}

export interface IMessagesService {
	getChatMessages(
		chatId: number,
		pagination?: IPagination,
	): Promise<IPaginationResult<IChatMessage>>;
	sendMessage(userId: number, payload: ISaveMessagePayload): Promise<IChatMessage>;
	deleteMessage(messageId: number): Promise<void>;
	getUnreadMessagesCount(userId: number): Promise<{ count: number }>;
}

export interface IGetChatsListAction {
	run(userId: number, pagination: IPagination): Promise<IPaginationResult<IChat>>;
}
