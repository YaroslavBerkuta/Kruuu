import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IGalleryModel } from '../interface';

@Entity('galleries')
export class Gallery implements IGalleryModel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	fileUrl: string;

	@Column()
	parentTable: string;

	@Column()
	parentId: string;

	@Column({ nullable: true })
	fileName: string;

	@Column({ nullable: true })
	mimetype: string;

	@Column({ nullable: true })
	data?: string;

	@CreateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	createdAt: string;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'LOCALTIMESTAMP' })
	updatedAt: string;
}
