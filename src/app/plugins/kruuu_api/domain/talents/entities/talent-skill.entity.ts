import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ITalentSkill } from '../typing';
import { TalentInfo } from './talent-info.entity';

@Entity('talentsSkills')
export class TalentSkill implements ITalentSkill {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@ManyToOne(() => TalentInfo, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	talent?: TalentInfo;

	@Column()
	skillTagId: number;
}
