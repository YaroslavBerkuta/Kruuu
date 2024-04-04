import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WsUsersService } from './ws-users.service';
import * as _ from 'lodash';
import { WsServerService } from './ws-server.service';
import { REAL_TIME_SERVICE, WSService } from '../typing';
import { Events, IEventsPayloads } from '~api/shared';

@Injectable()
export class WsEventsHandlersService {
	constructor(
		public readonly wsUsersService: WsUsersService,
		public readonly wsServerService: WsServerService,
		@Inject(REAL_TIME_SERVICE) private readonly wsService: WSService,
	) {}

	@OnEvent(Events.StopSessions)
	public async onStopSessions(dto: IEventsPayloads[Events.StopSessions]) {
		await this.wsUsersService.emit(dto.userId, 'stopSessions', { sessionsIds: dto.sessionsIds });
	}

	@OnEvent(Events.OnUserConnect)
	public async onUserConnect(dto: IEventsPayloads[Events.OnUserConnect]) {
		console.log('Event user connect', dto);

		const usersIds = await this.wsService.getUsersOnlineIds();
		if (_.includes(usersIds, dto.userId)) return;

		usersIds.map(it => {
			if (it !== dto.userId)
				this.wsService.emitToUser(it, 'user/connected', { userId: dto.userId });
		});
	}

	@OnEvent(Events.OnUserDisconnect)
	public async onUserDisconnect(dto: IEventsPayloads[Events.OnUserDisconnect]) {
		console.log('Event user disconnect', dto);

		const usersIds = await this.wsService.getUsersOnlineIds();
		if (_.includes(usersIds, dto.userId)) return;

		usersIds.map(it => {
			if (it !== dto.userId)
				this.wsService.emitToUser(it, 'user/disconnected', { userId: dto.userId });
		});
	}

	@OnEvent(Events.OnUserDeleted)
	public async onUserDeleted(dto: IEventsPayloads[Events.OnUserDeleted]) {
		const usersIds = await this.wsService.getUsersOnlineIds();
		usersIds.map(it => {
			if (it !== dto.userId) this.wsService.emitToUser(it, 'user/deleted', { userId: dto.userId });
		});
	}

	@OnEvent(Events.OnErrorJoinUser)
	public async onErrorJoinUser(dto: IEventsPayloads[Events.OnErrorJoinUser]) {
		if (!dto.socket) return;

		this.wsServerService.emitToClient(dto.socket, 'error/join-user');
	}
}
