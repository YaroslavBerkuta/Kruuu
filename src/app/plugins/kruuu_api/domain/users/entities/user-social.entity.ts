import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserSocialType } from '../typing';

@Entity('usersSocials')
export class UserSocial extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	type: UserSocialType;

	@Column()
	value: string;

	@Column()
	userId: number;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
