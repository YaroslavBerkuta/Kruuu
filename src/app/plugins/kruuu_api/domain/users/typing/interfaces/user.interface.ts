import { ActivatedCodeType, UserRole, UserSocialType, UserStatus } from '../enums';

export interface IUser {
	id: number;
	role: UserRole;
	status: UserStatus;
	email: string;
	name: string;
	password: string;
	passwordSalt: string;
	progressFill?: number;
	passphrase12words?: string;
	publicAddress?: string;
	createdAt: string;
	updatedAt: string;
}

export interface IUserShortInfo {
	userId: number;
	role?: UserRole;
	name?: string;
	avatarUrl?: string;
}

export interface IUserSocial {
	id: number;
	type: UserSocialType;
	value: string;
	userId: number;
}

export interface IUserActivatedCode {
	id: number;
	code: string;
	type: ActivatedCodeType;
}

export interface IUserUsedCodes {
	id: number;
	userId: number;
	codeId: number;

	user?: IUser;
	code?: IUserActivatedCode;
}
