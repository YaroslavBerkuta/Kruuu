import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { IChatMessage } from '../typing';
import { Chat } from './chat.entity';

@Entity('chatsMessages')
export class ChatMessage implements IChatMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chatId: number;

	@Column()
	userId: number;

	@Column({
		type: 'jsonb',
	})
	content: string;

	@Column({ nullable: false, default: false })
	isRead: boolean;

	@ManyToOne(() => Chat, chat => chat.chatMessages, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'chatId' })
	chat: Chat;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;
}
