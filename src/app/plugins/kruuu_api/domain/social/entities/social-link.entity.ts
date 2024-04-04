import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SocialLinkKey } from '../typing/enums';

@Entity('socialLinks')
export class SocialLink {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	parentType: string;

	@Column()
	parentId: number;

	@Column({ type: 'varchar' })
	key: SocialLinkKey;

	@Column()
	value: string;
}
