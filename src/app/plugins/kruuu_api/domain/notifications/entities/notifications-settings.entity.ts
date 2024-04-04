import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { INotificationsSettings } from '../typing/interfaces';
import { User } from '~api/domain/users/entities';

@Entity('notificationsSettings')
export class NotificationsSettings implements INotificationsSettings {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@Column({ type: 'boolean', default: true })
	appEnabled: boolean;

	@Column({ type: 'boolean', default: true })
	webEnabled: boolean;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createDate: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updateDate: string;
}
