import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Certificate } from './certificate.entity';
import { User } from '~api/domain/users/entities';
import { ICerteficateToUser } from '../typing';

@Entity('certeficateToUsers')
export class CerteficateToUser implements ICerteficateToUser {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	certeficateId: number;

	@Column()
	userId: number;

	@ManyToOne(() => Certificate)
	@JoinColumn({ name: 'certeficateId' })
	certeficate?: Certificate;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user?: User;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt?: string;
}
