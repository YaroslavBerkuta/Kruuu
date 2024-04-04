import { Logger, UseGuards } from '@nestjs/common';
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtWsGuard } from '../guards';
import { WsServerService, WsUsersService } from '../services';

@WebSocketGateway({
	transports: ['websocket'],
	cors: {
		origin: '*',
	},
})
export class MainGateway {
	private readonly logger = new Logger(MainGateway.name);

	constructor(
		private readonly wsServerService: WsServerService,
		private readonly wsUsersService: WsUsersService,
	) {}

	public afterInit(server: Server) {
		this.wsServerService.server = server;
	}

	@UseGuards(JwtWsGuard)
	@SubscribeMessage('join-user')
	async onUserConnect(@MessageBody() data, @ConnectedSocket() client: Socket): Promise<void> {
		await this.wsUsersService.joinUser(client, data);
	}

	/***** Logger *****/

	handleConnection() {
		this.logger.log('Connect new user to server');
	}

	handleDisconnect() {
		this.logger.log('User disconnect from server');
	}
}
