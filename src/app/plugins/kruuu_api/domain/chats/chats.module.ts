import { DynamicModule, Module } from '@nestjs/common';

import { provideClass } from '~api/shared';
import { EmployersModule } from '../employer/employer.module';
import { GalleryModule } from '../galleries/gallery.module';
import { RealTimeModule } from '../real-time/real-time.module';
import { TalentsModule } from '../talents/talents.module';
import { UsersModule } from '../users/users.module';
import { GetChatsListAction } from './actions';
import { Chat, ChatMember, ChatMessage } from './entities';
import { CHATS_GATEWAYS } from './gateways';
import {
	ChatsMembersService,
	ChatsMessagesService,
	ChatsService,
	CHATS_SERVICES,
} from './services';
import {
	CHATS_MEMBERS_REPOSITORY,
	CHATS_MEMBERS_SERVICE,
	CHATS_MESSAGES_REPOSITORY,
	CHATS_MESSAGES_SERVICE,
	CHATS_REPOSITORY,
	CHATS_SERVICE,
	GET_CHATS_LIST_ACTION,
} from './typing';
import { provideEntity } from '~api/libs';

@Module({})
export class ChatsModule {
	static getProviders() {
		return [
			provideEntity(CHATS_REPOSITORY, Chat),
			provideEntity(CHATS_MEMBERS_REPOSITORY, ChatMember),
			provideEntity(CHATS_MESSAGES_REPOSITORY, ChatMessage),
			provideClass(CHATS_SERVICE, ChatsService),
			provideClass(CHATS_MEMBERS_SERVICE, ChatsMembersService),
			provideClass(CHATS_MESSAGES_SERVICE, ChatsMessagesService),
			provideClass(GET_CHATS_LIST_ACTION, GetChatsListAction),
			...CHATS_SERVICES,
			...CHATS_GATEWAYS,
		];
	}

	static getExports() {
		return [
			CHATS_SERVICE,
			CHATS_MEMBERS_SERVICE,
			CHATS_MESSAGES_SERVICE,
			GET_CHATS_LIST_ACTION,
			CHATS_MEMBERS_REPOSITORY,
			CHATS_MESSAGES_REPOSITORY,
		];
	}

	static getImports() {
		return [
			UsersModule.forFeature(),
			RealTimeModule.forFeature(),
			TalentsModule.forFeature(),
			EmployersModule.forFeature(),
			GalleryModule.forFeature(),
		];
	}

	static forRoot(): DynamicModule {
		return {
			module: ChatsModule,
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: ChatsModule,
			providers: ChatsModule.getProviders(),
			imports: ChatsModule.getImports(),
			exports: ChatsModule.getExports(),
		};
	}
}
