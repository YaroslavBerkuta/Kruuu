import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IJobAppearance } from '../typing';
import { Job } from './jobs.entity';

@Entity('jobsAppearance')
export class JobAppearance implements IJobAppearance {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	bodyType: string;

	@Column()
	height: string;

	@Column()
	ethnic: string;

	@Column()
	eyeColor: string;

	@Column()
	hairLength: string;

	@Column()
	hairColor: string;

	@Column()
	jobId: number;

	@OneToOne(() => Job, job => job.appearance, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'jobId' })
	job: Job;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
