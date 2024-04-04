import { Tag } from '~api/domain/tags/entities';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IJobsToTags } from '../typing';
import { Job } from './jobs.entity';
@Entity('jobsToTags')
export class JobToTag implements IJobsToTags {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	jobId: number;

	@Column()
	tagId: number;

	@ManyToOne(() => Job, job => job.skills, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'jobId' })
	job: Job;

	@ManyToOne(() => Tag, tag => tag.tagToJob)
	@JoinColumn({ name: 'tagId' })
	tag: Tag;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
