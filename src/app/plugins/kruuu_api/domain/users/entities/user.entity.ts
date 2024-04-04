import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserRole, UserStatus } from '../typing';
import { Payment } from '~api/domain/payment/entities';
import { UserUsedCode } from './user-used-codes.etity';
import { CerteficateToUser } from '~api/domain/certificates/entities/certificate-to-user.entity';

@Entity('users')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'char', nullable: false })
	role: UserRole;

	@Column({ type: 'char', default: UserStatus.Active, nullable: false })
	status: UserStatus;

	@Column({ type: 'float', default: 0, nullable: true })
	progressFill: number;

	@Column({ type: 'varchar', nullable: false })
	email: string;

	@Column({ nullable: true })
	name: string;

	@Column({ default: '' })
	publicAddress: string;

	@Column({ type: 'varchar', nullable: false, select: false })
	password: string;

	@Column({ type: 'varchar', nullable: false, select: false })
	passwordSalt: string;

	@Column({ type: 'varchar', nullable: true, select: false })
	passphrase12words: string;

	@OneToMany(() => Payment, pay => pay.user)
	payments?: Payment[];

	@OneToMany(() => UserUsedCode, uuc => uuc.code)
	codeToUser?: UserUsedCode[];

	@OneToMany(() => CerteficateToUser, ctu => ctu.certeficate)
	certeficateToUser?: CerteficateToUser[];

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
