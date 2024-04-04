import { UserRole } from '~api/domain/users/typing';
import { SessionType } from '../enums';
import { ISession } from './session.interface';
import { ITokenPair } from './token-pair.interface';

export interface IStartSessionPayload {
	userId: number;
	role?: UserRole;
	type: SessionType;
	deviceName: string;
}

export interface ISessionsService {
	start(payload: IStartSessionPayload): Promise<ISession>;

	getByUserId(userId: number): Promise<ISession[]>;

	getSessionsByTokens(refreshTokens: string[], selectFields?: string[]): Promise<ISession[]>;

	refresh(token: string): Promise<ITokenPair>;

	finish(id: number): Promise<void>;

	finishByToken(token: string): Promise<void>;

	checkTokenDeprecation(token: string): Promise<boolean>;

	closeAllUserSessions(userId: number, execludeIds?: number[]): Promise<void>;
}
