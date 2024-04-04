import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IJobsResidence } from '../typing';
import { Job } from './jobs.entity';

@Entity('jobsResidence')
export class JobResidence implements IJobsResidence {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	nationality: string;

	@Column()
	residence: string;

	@Column()
	jobId: number;

	@OneToOne(() => Job, job => job.residence, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'jobId' })
	job?: Job;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
