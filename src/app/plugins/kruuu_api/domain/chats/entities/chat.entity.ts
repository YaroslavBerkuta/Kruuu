import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IChat } from '../typing';
import { ChatMember } from './chat-member.entity';
import { ChatMessage } from './chat-message.entity';

@Entity('chats')
export class Chat implements IChat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'timestamp', nullable: true, default: () => 'LOCALTIMESTAMP' })
	lastMessageDate: string;

	@OneToMany(() => ChatMember, chatMember => chatMember.chat)
	chatMembers: ChatMember[];

	@OneToMany(() => ChatMessage, chatMessage => chatMessage.chat)
	chatMessages: ChatMessage[];

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;
}
