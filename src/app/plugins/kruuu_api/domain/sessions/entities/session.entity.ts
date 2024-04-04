import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ISession, SessionType } from '../typing';

@Entity('sessions')
export class Session implements ISession {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column({ type: 'varchar', nullable: false })
	accessToken: string;

	@Column({ type: 'varchar', nullable: false })
	refreshToken: string;

	@Column({ type: 'varchar', nullable: false })
	deviceName: string;

	@Column({ type: 'char', nullable: false, default: SessionType.App })
	type: SessionType;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
