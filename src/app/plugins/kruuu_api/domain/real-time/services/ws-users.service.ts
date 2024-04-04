import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from 'eventemitter2';
import { Socket } from 'socket.io';

import { WsServerService } from './ws-server.service';
import { Events } from '~api/shared';

@Injectable()
export class WsUsersService {
	private readonly logger = new Logger(WsUsersService.name);

	constructor(
		private wsServerService: WsServerService,
		private readonly eventsEmitter: EventEmitter2,
	) {}

	public joinUser(client: Socket, data: { user: any }) {
		try {
			const { user } = data;

			if (!user || !user.id) {
				this.logger.warn('Error connect user');
				return;
			}

			this.eventsEmitter.emit(Events.OnUserConnect, {
				userId: user.id,
				sessionType: user?.sessionType,
			});

			client.join(this.getUserRoom(user.id));

			client.addListener('disconnect', () => this.disconnectUser(data));
		} catch (e) {
			this.logger.warn('Error join user');
		}
	}

	public disconnectUser(data: { user: any }) {
		try {
			const { user } = data;

			if (!user || !user.id) {
				this.logger.warn('Error disconnect user');
				return;
			}
			this.eventsEmitter.emit(Events.OnUserDisconnect, {
				userId: user.id,
				sessionType: user?.sessionType,
			});
		} catch (e) {
			this.logger.warn('Error disconnect user');
		}
	}

	public emit(userId: number, event: string, payload?: unknown) {
		this.wsServerService.emitToRoom(this.getUserRoom(userId), event, payload);
	}

	private getUserRoom(userId: number) {
		return `user-${userId}`;
	}
}
