import { DynamicModule, Module } from '@nestjs/common';
import { ChatsModule, RealTimeModule } from '~api/domain';
import { JwtModule } from '~api/libs';
import {
	AppChatsController,
	AppChatsMembersController,
	AppChatsMessagesController,
} from './controllers';
import { AppChatsMembersService, AppChatsMessagesService, AppChatsService } from './services';

@Module({})
export class AppChatsModule {
	static forRoot(): DynamicModule {
		return {
			module: AppChatsModule,
			imports: [JwtModule.forFeature(), ChatsModule.forFeature(), RealTimeModule.forFeature()],
			providers: [AppChatsService, AppChatsMessagesService, AppChatsMembersService],
			controllers: [AppChatsController, AppChatsMessagesController, AppChatsMembersController],
		};
	}
}
