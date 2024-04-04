import { AppAccountModule } from './account/app-account.module';
import { AppAuthModule } from './auth/app-auth.module';
import { AppChatsModule } from './chats/app-chats.module';
import { AppDuitkuModule } from './duitku/app-duitku.module';
import { AppNotificationsModule } from './notifications/app-notifications.module';
import { AppTagsModule } from './tags/app-tags.module';
import { AppUsersModule } from './users/app-users.module';
import { AppWalletsModule } from './wallets/wallets.module';

export const getRestAppModules = () => [
	AppUsersModule.forRoot(),
	AppAuthModule.forRoot(),
	AppTagsModule.forRoot(),
	AppAccountModule.forRoot(),
	AppChatsModule.forRoot(),
	AppNotificationsModule.forRoot(),
	AppDuitkuModule.forRoot(),
	AppWalletsModule.forRoot(),
];
