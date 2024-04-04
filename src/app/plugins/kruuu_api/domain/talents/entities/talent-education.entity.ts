import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ITalentEducation } from '../typing';
import { TalentInfo } from './talent-info.entity';

@Entity('talentsEducations')
export class TalentEducation implements ITalentEducation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	talentId: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@ManyToOne(() => TalentInfo)
	@JoinColumn({ name: 'talentId' })
	talent?: TalentInfo;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
