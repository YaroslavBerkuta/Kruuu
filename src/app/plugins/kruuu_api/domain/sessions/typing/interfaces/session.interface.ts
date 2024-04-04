import { SessionType } from '../enums';

export interface ISession {
	id?: number;
	userId: number;
	accessToken: string;
	refreshToken: string;
	deviceName: string;
	createdAt?: string;
	updatedAt?: string;
	type: SessionType;
}
