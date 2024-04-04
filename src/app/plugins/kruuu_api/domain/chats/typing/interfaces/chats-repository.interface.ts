import { Repository } from 'typeorm';
import { IChatMember } from './chat-member.interface';
import { IChatMessage } from './chat-message.interface';
import { IChat } from './chat.interface';

export type IChatsRepository = Repository<IChat>;
export type IChatsMembersRepository = Repository<IChatMember>;
export type IChatsMessagesRepository = Repository<IChatMessage>;
