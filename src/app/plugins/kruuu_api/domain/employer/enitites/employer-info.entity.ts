import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { EmployerType, FacilitiesAndServices, IEmployerInfo } from '../typing';
import { User } from '~api/domain/users/entities';
import { Application } from '~api/domain/applications/entities';

@Entity('employersInfo')
export class EmployerInfo implements IEmployerInfo {
	@PrimaryColumn()
	userId: number;

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user?: User;

	@Column({ nullable: true })
	name: string;

	@Column({ type: 'varchar', nullable: true })
	type: EmployerType;

	@Column({ type: 'varchar', nullable: true })
	facilAndServ: FacilitiesAndServices;

	@Column({ nullable: true })
	location?: string;

	@Column({ nullable: true })
	countryCode?: string;

	@Column({ nullable: true })
	established: number;

	@Column({ nullable: true })
	industry: string;

	@Column({ nullable: true })
	description?: string;

	@Column({ nullable: true })
	mobileNumber?: string;

	@Column({ nullable: true })
	email?: string;

	@Column({ nullable: true })
	siupp?: string;

	@Column({ nullable: true })
	owner?: string;

	@Column({ nullable: true })
	npwp?: string;

	@Column({ nullable: true })
	websiteName?: string;

	@Column({ nullable: true })
	anotherLink?: string;

	@OneToMany(() => Application, app => app.employer)
	applications?: Application[];
}
