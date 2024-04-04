import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule, FilesStorageModule, JwtModule, RedisModule } from './libs';
import { $config } from './config';
import { UsersModule } from './domain/users/users.module';
import { getEnv } from './shared';
import { WalletsModule } from './domain/wallets/wallets.module';
import { ConfirmationModule } from './domain/confirmation/confirmation.module';
import { TagsModule } from './domain/tags/tags.module';
import { SocialModule } from './domain/social/social.module';
import { SessionsModule } from './domain/sessions/sessions.module';
import { TalentsModule } from './domain/talents/talents.module';
import { EmployersModule } from './domain/employer/employer.module';
import { JobModule } from './domain/jobs/jobs.module';
import { RealTimeModule } from './domain/real-time/real-time.module';
import { ChatsModule } from './domain/chats/chats.module';
import { ApplicationModule } from './domain/applications/applications.module';
import { PaymentModule } from './domain/payment/payment.module';
import { StripeModule } from './domain/stripe/stripe.module';
import { DuitkuModule } from './domain/duitku/duitku.module';
import { NotificationsModule } from './domain/notifications/notifications.module';
import { PushNotificationsModule } from './libs/push-notifications/push-notifications.module';
import { GoogleModule } from './libs/google';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getRestModules } from './rest';
import { CertificationsModule, InstitutionModule, MailerModule } from './domain';
import { BlockchainAPIModule } from './libs/blockchain/blockchain.module';
import { ProjectsModule } from './domain/projects/projects.module';
import { getRpcModules } from './rpc';
import { AppleModule } from './libs/apple/apple.module';

@Module({
	imports: [
		DatabaseModule.forRoot(...$config.getDatabaseConfig()),
		JwtModule.forRoot($config.getJwtConfig()),
		RedisModule.forRoot($config.getRedisConfig()),
		FilesStorageModule.forRoot($config.getFilesStorageConfig()),
		MailerModule.forRoot($config.getMailerConfig()),
		AppleModule.forRoot({
			appleAppId: getEnv('APPLE_APP_ID'),
		}),

		PushNotificationsModule.forRoot($config.getPushNotificationsConfig()),
		GoogleModule.forRoot({ clientId: getEnv('GOOGLE_CLIENT_ID') }),
		EventEmitterModule.forRoot(),

		UsersModule.forRoot({ passwordHashSalt: getEnv('LOCAL_HASH_SALT') }),
		WalletsModule.forRoot(),
		ConfirmationModule.forRoot(),
		TagsModule.forRoot(),
		SocialModule.forRoot(),

		FilesStorageModule.forRoot($config.getFilesStorageConfig()),
		SessionsModule.forRoot(),
		TagsModule.forRoot(),
		SocialModule.forRoot(),
		TalentsModule.forRoot(),
		EmployersModule.forRoot(),
		InstitutionModule.forRoot(),
		JobModule.forRoot(),
		RealTimeModule.forRoot(),
		ChatsModule.forRoot(),
		ProjectsModule.forRoot(),

		ApplicationModule.forRoot(),
		PaymentModule.forRoot(),
		StripeModule.forRoot($config.getStripeConfig()),
		NotificationsModule.forRoot(),
		DuitkuModule.forRoot($config.getDuitkuConfig()),
		WalletsModule.forRoot(),

		BlockchainAPIModule.forRoot({
			autoInitDID: getEnv('AUTO_INIT_DID') === 'true',
		}),
		CertificationsModule.forRoot(),

		...getRestModules(),
		...getRpcModules(),
	],
	controllers: [AppController],
})
export class AppModule {}
