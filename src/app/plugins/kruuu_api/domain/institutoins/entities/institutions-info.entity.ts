import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '~api/domain/users/entities';
import { IInstitution } from '../typing';

@Entity('institutionInfo')
export class InstitutionInfo implements IInstitution {
	@PrimaryColumn()
	userId: number;

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user?: User;

	@Column({ nullable: true })
	name?: string;

	@Column({ nullable: true })
	establish?: string;

	@Column({ nullable: true })
	address?: string;

	@Column({ nullable: true })
	descriptions?: string;

	@Column({ nullable: true })
	email?: string;

	@Column({ nullable: true })
	mobileNumber?: string;
}
