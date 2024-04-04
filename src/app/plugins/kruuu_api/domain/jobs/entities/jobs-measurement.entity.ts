import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IJobMeasurement } from '../typing';
import { Job } from './jobs.entity';

@Entity('jobsMeasurement')
export class JobMeasurement implements IJobMeasurement {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	top: string;

	@Column()
	trousers: string;

	@Column()
	shoes: string;

	@Column()
	jobId: number;

	@OneToOne(() => Job, job => job.measurement, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'jobId' })
	job: Job;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
