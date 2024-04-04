import { Injectable } from '@nestjs/common';
import { WSService } from '../typing';
import { WsServerService } from './ws-server.service';

@Injectable()
export class WsService implements WSService {
	constructor(private wsServerService: WsServerService) {}

	public isUserOnline(userId: number): boolean {
		return this.wsServerService.isUserOnline(userId);
	}

	async getUsersOnlineCount(): Promise<number> {
		return this.wsServerService.getUsersOnlineCount();
	}

	public emitToRoom(room: string, key: string, data?: any) {
		this.wsServerService.emitToRoom(room, key, data);
	}

	public async getUsersOnlineIds() {
		return this.wsServerService.getUsersOnlineIds();
	}

	public emitToUser(userId: number, key: string, data?: any) {
		console.log('Send event', userId, key);
		this.wsServerService.emitToRoom(`user-${userId}`, key, data);
	}

	public emitToAll(key: string) {
		this.wsServerService.emit(key);
	}
}
