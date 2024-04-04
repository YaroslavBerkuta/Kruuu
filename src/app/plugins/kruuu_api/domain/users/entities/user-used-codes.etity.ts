import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { UserCode } from './user-codes.entity';
import { IUserUsedCodes } from '../typing';

@Entity('userUsedCodes')
export class UserUsedCode implements IUserUsedCodes {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column()
	codeId: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'userId' })
	user?: User;

	@ManyToOne(() => UserCode)
	@JoinColumn({ name: 'codeId' })
	code?: UserCode;
}
