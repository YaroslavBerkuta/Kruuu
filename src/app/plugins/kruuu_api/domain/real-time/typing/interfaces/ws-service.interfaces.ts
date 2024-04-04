export interface WSService {
	isUserOnline(userId: number): boolean;
	getUsersOnlineCount(): Promise<number>;
	emitToRoom(room: string, key: string, data?: any): void;
	getUsersOnlineIds(): Promise<number[]>;
	emitToUser(userId: number, key: string, data?: any): void;
	emitToAll(key: string, data?: any);
}
