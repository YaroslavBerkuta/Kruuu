import { FindOptionsWhere } from 'typeorm';
import { ActivatedCodeType, UserRole, UserSocialType } from '../enums';
import { IUser } from './user.interface';

export interface CreateUserPayload {
	role: UserRole;
	email: string;
	password: string;
	name?: string;
}

export interface UpdateUserPayload {}

export interface IUsersService {
	create(payload: CreateUserPayload): Promise<number>;
	update(id: number, payload: UpdateUserPayload): Promise<void>;
	delete(id: number): Promise<void>;
	getOneByEmail(email: string): Promise<IUser>;
	compareUserPassword(userId: number, password: string): Promise<boolean>;
	getOneBy(where: FindOptionsWhere<IUser> | FindOptionsWhere<IUser>[]): Promise<IUser>;
	changeUserPassword(userId: number, newPassword: string): Promise<void>;
	changeFillProgress(
		userId: number,
		fieldsCount: number,
		completeFieldsCount: number,
	): Promise<void>;
	getSocialUser(
		id: string,
		type: UserSocialType,
		userData: { email: string; name?: string; role?: UserRole },
	): Promise<IUser>;
	getUserByPublicAddress(publicAddress: string): Promise<IUser>;
}

export interface IUserActivedetCodeService {
	create(payload: IStoreCodePayload): Promise<void>;
	activeCode(userId: number, payload: IActiveCodePayload): Promise<boolean>;
}

export interface IStoreCodePayload {
	code: string;
	type: ActivatedCodeType;
}

export interface IActiveCodePayload {
	code: string;
	type: ActivatedCodeType;
}
