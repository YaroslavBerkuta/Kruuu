import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TalentInfo } from './talent-info.entity';
import { ITalentLike } from '../typing';

@Entity('talentLikes')
export class TalentLike implements ITalentLike {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	employerId: number;

	@Column()
	talentId: number;

	@ManyToOne(() => TalentInfo)
	@JoinColumn({ name: 'talentId' })
	talent?: TalentInfo;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createDate: string;
}
