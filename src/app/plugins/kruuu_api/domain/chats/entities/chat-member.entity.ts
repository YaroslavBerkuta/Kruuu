import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { IChatMember } from '../typing';
import { Chat } from './chat.entity';

@Entity('chatsMembers')
export class ChatMember implements IChatMember {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chatId: number;

	@Column()
	userId: number;

	@Column({ nullable: false, default: false })
	isDeleted: boolean;

	@CreateDateColumn({ nullable: true, type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	addedAt: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@ManyToOne(() => Chat, chat => chat.chatMembers, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'chatId' })
	chat: Chat;
}
