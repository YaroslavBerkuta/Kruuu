import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { INotification } from '../typing/interfaces';
import { NotificationsGroup } from '../typing/enums';
import { User } from '~api/domain/users/entities';

@Entity('notifications')
export class Notification implements INotification {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'jsonb',
		nullable: true,
	})
	data?: Record<string, string>;

	@Column()
	title: string;

	@Column({ nullable: true })
	content: string;

	@Column({
		type: 'varchar',
		default: NotificationsGroup.Other,
	})
	group: NotificationsGroup;

	@Column({
		default: false,
		nullable: true,
	})
	isRead: boolean;

	@Column({
		nullable: true,
	})
	imageUrl?: string;

	@Column()
	userId: number;

	@ManyToOne(() => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	user?: User;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createAt: string;
}
