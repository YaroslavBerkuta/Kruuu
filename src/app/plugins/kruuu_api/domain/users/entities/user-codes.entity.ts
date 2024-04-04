import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActivatedCodeType, IUserActivatedCode } from '../typing';
import { UserUsedCode } from './user-used-codes.etity';

@Entity('usersCodes')
export class UserCode implements IUserActivatedCode {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	code: string;

	@Column({ type: 'varchar', enum: ActivatedCodeType })
	type: ActivatedCodeType;

	@OneToMany(() => UserUsedCode, uuc => uuc.code)
	codeToUser?: UserUsedCode[];
}
