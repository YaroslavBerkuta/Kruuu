import { ChatsAccessoryService } from './chats-accessory.service';
import { ChatsEventsService } from './chats-events.service';
import { ChatsMembersService } from './chats-members.service';
import { ChatsMessagesService } from './chats-messages.service';
import { ChatsService } from './chats.service';

export const CHATS_SERVICES = [
	ChatsService,
	ChatsAccessoryService,
	ChatsEventsService,
	ChatsMembersService,
	ChatsMessagesService,
];

export { ChatsService, ChatsMembersService, ChatsMessagesService };
