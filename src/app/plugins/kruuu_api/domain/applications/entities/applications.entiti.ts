import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus, IApplication } from '../typing';
import { Job } from '~api/domain/jobs/entities';
import { TalentInfo } from '~api/domain/talents/entities';
import { EmployerInfo } from '~api/domain/employer/enitites';

@Entity('applications')
export class Application implements IApplication {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', enum: ApplicationStatus, default: ApplicationStatus.Applicants })
	status: ApplicationStatus;

	@Column()
	talentId: number;

	@Column()
	jobId: number;

	@Column()
	employerId: number;

	@ManyToOne(() => Job, job => job.applications, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'jobId' })
	job?: Job;

	@ManyToOne(() => TalentInfo, ti => ti.applications)
	@JoinColumn({ name: 'talentId' })
	talent?: TalentInfo;

	@ManyToOne(() => EmployerInfo, ei => ei.applications)
	@JoinColumn({ name: 'employerId' })
	employer?: EmployerInfo;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
