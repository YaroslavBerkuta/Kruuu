import { IChatMember } from './chat-member.interface';
import { IChatMessage } from './chat-message.interface';

export interface IChat {
	id: number;
	lastMessageDate: string;
	otherMember?: IChatMember;
	chatMembers?: IChatMember[];
	chatMessages?: IChatMessage[];
	messagesCount?: number;
	unreadMessagesCount?: number;
	lastMessage?: IChatMessage;
	createdAt: string;
	firstMessageId?: number;
	lastMessageId?: number;
}
