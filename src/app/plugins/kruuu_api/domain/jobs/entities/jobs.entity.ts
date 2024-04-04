import { Application } from '~api/domain/applications/entities';
import { Project } from '~api/domain/projects/entities';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IJob } from '../typing';
import { JobAppearance } from './jobs-appearance.entity';
import { JobMeasurement } from './jobs-measurement.entity';
import { JobResidence } from './jobs-residence.entity';
import { JobToTag } from './jobs-to-tags.entity';
import { Currency } from '~api/domain/wallets/typing';
import { JobStatus } from '../typing/enums';

@Entity('jobs')
export class Job implements IJob {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ select: false, nullable: true })
	blochaineUuid?: string;

	@Column()
	projectId: number;

	@Column()
	title: string;

	@Column()
	industry: number;

	@Column({ nullable: true })
	type: number;

	@Column()
	job: number;

	@Column()
	peopleNeeded: string;

	@Column()
	experience: string;

	@Column()
	startingDate: string;

	@Column()
	duration: string;

	@Column()
	location: string;

	@Column({ type: 'text' })
	description: string;

	@Column()
	payment: string;

	@Column({ nullable: true })
	uniqueKey: string;

	@Column({ type: 'varchar', default: JobStatus.New })
	status: JobStatus;

	@Column({ type: 'varchar', enum: Currency, default: Currency.USD })
	currency: Currency;

	@OneToOne(() => JobAppearance, jb => jb.job)
	appearance: JobAppearance;

	@OneToOne(() => JobMeasurement, jm => jm.job)
	measurement: JobMeasurement;

	@OneToMany(() => JobToTag, jobTag => jobTag.job)
	skills: JobToTag[];

	@OneToOne(() => JobResidence, jr => jr.job)
	residence?: JobResidence;

	@ManyToOne(() => Project, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'projectId' })
	project?: Project;

	@OneToMany(() => Application, app => app.job)
	applications?: Application[];

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
