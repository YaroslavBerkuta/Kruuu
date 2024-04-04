import { Job } from '~api/domain/jobs/entities';
import { User } from '~api/domain/users/entities';
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
import { IProject } from '../typing';
import { ProjectStatus } from '../typing/enums';

@Entity('projects')
export class Project implements IProject {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', default: ProjectStatus.InProgress })
	status: ProjectStatus;

	@Column()
	creatorId: number;

	@Column()
	title: string;

	@Column()
	industryId: number;

	@Column()
	typeId: number;

	@Column()
	startingDate: string;

	@Column()
	duration: string;

	@Column()
	location: string;

	@Column({ select: false, nullable: true })
	blochaineUuid: string;

	@Column({ type: 'text' })
	descriptions: string;

	@Column()
	budget: string;

	@Column({ nullable: true })
	lockedTokenBeddows?: string;

	@Column({ nullable: true })
	uniqueKey: string;

	@OneToMany(() => Job, job => job.project)
	jobs?: Job[];

	@Column({ type: 'jsonb', default: { blockUpdatesCount: 1 } })
	meta?: any;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;

	@ManyToOne(() => User, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'creatorId' })
	creator?: User;
}
