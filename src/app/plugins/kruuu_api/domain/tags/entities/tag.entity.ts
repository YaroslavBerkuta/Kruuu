import { JobResidence, JobToTag } from '~api/domain/jobs/entities';
import { TagCategory } from '../typing';

import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tags')
export class Tag extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ nullable: true, default: null })
	key?: string;

	@Column({ nullable: true, default: null })
	parentId?: number;

	@Column({ type: 'varchar' })
	category: TagCategory;

	@Column({ nullable: true, default: null })
	authorId?: number;

	@Column({ default: false })
	isCustom?: boolean;

	@OneToMany(() => JobToTag, jobTag => jobTag.tag)
	tagToJob: JobToTag[];

	@OneToMany(() => JobResidence, jb => jb.nationality)
	jobNationality: JobResidence[];

	@OneToMany(() => JobResidence, jb => jb.residence)
	jobResidence: JobResidence[];
}
