import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ICertificate } from '../typing/interfaces/certificate.interface';
import { CerteficateToUser } from './certificate-to-user.entity';
import { Term } from '~api/shared';
import { User } from '~api/domain/users/entities';

@Entity('certifications')
export class Certificate implements ICertificate {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	startDate: string;

	@Column({ nullable: true })
	durationTime?: string;

	@Column({ type: 'varchar', enum: Term, nullable: true })
	durationTerm?: Term;

	@Column()
	location: string;

	@Column()
	descriptions: string;

	@Column()
	userId: number;

	@OneToMany(() => CerteficateToUser, ctu => ctu.certeficate)
	certeficateToUser?: CerteficateToUser[];

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user: User;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt?: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt?: string;
}
