import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../typing/enums';
import { IWallet } from '../typing/interfaces';
import { User } from '~api/domain/users/entities';

@Entity('wallets')
export class Wallet implements IWallet {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar' })
	currency: Currency;

	@Column({ nullable: true })
	name: string;

	@Column()
	userId: number;

	@Column({ type: 'numeric', default: 1 })
	factor: number;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user?: User;

	@Column({ type: 'varchar', default: '0' })
	balance: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
