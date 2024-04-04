import { Application } from '~api/domain/applications/entities';
import { User } from '~api/domain/users/entities';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { HairColor, HairLength, ITalentInfo } from '../typing';
import { BodyType, Ethnicity, EyeColor, Gender } from '../typing';
import { TalentEducation } from './talent-education.entity';
import { TalentSkill } from './talent-skill.entity';
import { TalentLike } from './talent-likes.enetity';

@Entity('talentsInfo')
export class TalentInfo implements ITalentInfo {
	@PrimaryColumn()
	userId: number;

	@OneToOne(() => User, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	user?: User;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true })
	mainOccupTagId: number;

	@Column({ nullable: true })
	secondOccupTagId?: number;

	@Column({ nullable: true })
	representative?: string;

	@Column({ nullable: true })
	dateOfBirth?: string;

	@Column({ type: 'varchar', nullable: true })
	gender: Gender;

	@Column({ nullable: true })
	nationality?: string;

	@Column({ type: 'varchar', nullable: true })
	ethnicity: Ethnicity;

	@Column({ nullable: true })
	location?: string;

	@Column({ nullable: true })
	countryCode?: string;

	@Column({ nullable: true })
	experience?: number;

	@Column({ nullable: true })
	height?: number;

	@Column({ nullable: true })
	weight?: number;

	@Column({ type: 'varchar', nullable: true })
	eyeColor?: EyeColor;

	@Column({ nullable: true })
	waist?: number;

	@Column({ type: 'varchar', nullable: true })
	bodyType?: BodyType;

	@Column({ type: 'varchar', nullable: true })
	hairColor?: HairColor;

	@Column({ type: 'varchar', nullable: true })
	hairLength?: HairLength;

	@Column({ nullable: true })
	ageFrom?: number;

	@Column({ nullable: true })
	ageTo?: number;

	@Column({ nullable: true })
	mobileNumber?: string;

	@Column({ nullable: true })
	email?: string;

	@Column({ nullable: true })
	payPerDay?: number;

	@Column({ nullable: true })
	currency?: string;

	@Column({ nullable: true })
	description?: string;

	@Column({ type: 'text', nullable: true })
	qualifications?: string;

	@OneToMany(() => TalentSkill, skill => skill.talent, { onDelete: 'RESTRICT' })
	skills?: TalentSkill[];

	@OneToMany(() => Application, app => app.talent)
	applications?: Application[];

	@OneToMany(() => TalentEducation, te => te.talent)
	educations?: TalentEducation[];

	@OneToMany(() => TalentLike, tl => tl.talent)
	likes?: TalentLike[];
}
