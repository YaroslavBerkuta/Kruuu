import { WsEventsHandlersService } from './ws-events-handlers.service';
import { WsServerService } from './ws-server.service';
import { WsUsersService } from './ws-users.service';
import { WsService } from './ws.service';

export const REAL_TIME_SERVICES = [WsServerService, WsUsersService, WsEventsHandlersService];

export { WsServerService, WsUsersService, WsEventsHandlersService, WsService };
