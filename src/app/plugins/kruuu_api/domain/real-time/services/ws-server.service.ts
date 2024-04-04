import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as _ from 'lodash';

@Injectable()
export class WsServerService {
	private _server: Server;

	public set server(val) {
		this._server = val;
	}

	public get server() {
		return this._server;
	}

	public emit(key: string) {
		this.server.emit(key);
	}

	public joinToRoom(client: Socket, roomName: string) {
		client.join(roomName);
	}

	public emitToRoom(room: string, key: string, data?: any) {
		this.server.to(room).emit(key, data);
	}

	public emitToClient(client: Socket, key: string, data?: any) {
		client.emit(key, data);
	}

	public getRoomSockets(room: string): string[] {
		try {
			const roomsMap = this.server._nsps.get('/').adapter.rooms;
			const rooms = Object.fromEntries(roomsMap);

			const roomSockets: string[] = [];
			if (!_.isEmpty(rooms[room])) {
				rooms[room].forEach((_, value2) => roomSockets.push(value2));
			}

			return roomSockets;
		} catch (e) {
			return [];
		}
	}

	public async sendTest() {
		const usersOnline = await this.getUsersOnlineCount();

		this.server.emit('websocket/test', `Real time test \n users online - ${usersOnline}`);
	}

	public isUserOnline(userId: number): boolean {
		try {
			return this.getRoomSockets(`user-${userId}`).length > 0;
		} catch (e) {
			console.log('SOCKET NOT WORK');
			return false;
		}
	}

	async getUsersOnlineCount(): Promise<number> {
		return new Promise((resolve, reject) => {
			try {
				let usersOnlineCounter = 0;

				const rooms: any = this.server['server'].nsps['/'].adapter.rooms;
				for (const room in rooms) {
					if (room.startsWith('user-') && Object.keys(rooms[room].sockets).length > 0)
						usersOnlineCounter++;
				}
				resolve(usersOnlineCounter);
			} catch (e) {
				reject(e);
			}
		});
	}

	async getUsersOnlineIds(): Promise<number[]> {
		return new Promise((resolve, reject) => {
			try {
				const roomsMap = this.server._nsps.get('/').adapter.rooms;
				const rooms = Object.fromEntries(roomsMap);

				const ids: number[] = [];

				for (const room in rooms) {
					if (room.startsWith('user-') && !_.isEmpty(rooms[room]))
						ids.push(Number(room.substring(5)));
				}
				resolve(ids);
			} catch (e) {
				reject(e);
			}
		});
	}
}
