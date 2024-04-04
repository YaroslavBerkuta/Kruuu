import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletActionType } from '../typing/enums';
import { IWalletAction } from '../typing/interfaces';
import { Wallet } from './wallet.entity';

@Entity('walletsActions')
export class WalletAction implements IWalletAction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	walletId: number;

	@Column({ type: 'numeric' })
	value: number;

	@Column({ type: 'numeric' })
	balanceSnapshoot: number;

	@Column({ type: 'varchar', default: WalletActionType.Add })
	type: WalletActionType;

	@Column({ nullable: false })
	reason: string;

	@Column({ nullable: true, type: 'jsonb' })
	data?: any;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@ManyToOne(() => Wallet, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'walletId' })
	wallet?: Wallet;
}
