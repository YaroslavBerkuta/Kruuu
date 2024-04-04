import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationType } from '~api/shared';
import { INotificationUserDevice } from '../typing/interfaces';
import { User } from '~api/domain/users/entities';

@Entity('notificationsUsersDevices')
export class NotificationUserDevice implements INotificationUserDevice {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	notificationUserId: string;

	@Column({
		unique: true,
	})
	deviceUuid: string;

	@Column({
		type: 'varchar',
		default: ApplicationType.App,
	})
	applicationType: ApplicationType;

	@Column()
	userId: number;

	@ManyToOne(() => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	user?: User;

	@CreateDateColumn({ type: 'timestamp', name: 'createAt', default: () => 'LOCALTIMESTAMP' })
	createDate: string;
}
