import { Repository } from 'typeorm';
import { IUser, IUserActivatedCode, IUserSocial, IUserUsedCodes } from './user.interface';

export type IUsersRepository = Repository<IUser>;
export type IUsersSocialsRepository = Repository<IUserSocial>;
export type IUserActivatedCodeRepository = Repository<IUserActivatedCode>;
export type IUserUsedCodesRepository = Repository<IUserUsedCodes>;
