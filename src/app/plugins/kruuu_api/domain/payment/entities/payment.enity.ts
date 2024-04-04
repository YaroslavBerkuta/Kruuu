import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IPayment, PaymentStatus } from '../typing';
import { User } from '~api/domain/users/entities';

@Entity('payments')
export class Payment implements IPayment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', enum: PaymentStatus, default: PaymentStatus.WaitPayment })
	status: PaymentStatus;

	@Column({ type: 'jsonb', nullable: true })
	date: string;

	@Column({ type: 'varchar' })
	paymentMethod: string;

	@Column()
	paymentId: string;

	@Column()
	userId: number;

	@ManyToOne(() => User, user => user.payments, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'userId' })
	user?: User;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
