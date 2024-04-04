import { DynamicModule, Module } from '@nestjs/common';
import { MailerModule as Mailer } from '@nestjs-modules/mailer';
import { provideClass } from '~api/shared';
import { TelegramMailerService, MailerService } from './services';
import { IMailerModuleOptions, MAILER_SERVICE } from './typing';

@Module({})
export class MailerModule {
	static options: IMailerModuleOptions;

	static getExports() {
		return [MAILER_SERVICE];
	}

	static getImports() {
		const { options } = MailerModule;
		if (options.test) return [];

		return [
			Mailer.forRoot({
				transport: {
					port: options.port,
					host: `${options.domain}`,
					secure: options.secure,
					auth: {
						user: options.login,
						pass: options.password,
					},
				},
				defaults: {
					from: options.login,
				},
			}),
		];
	}

	static forRoot(options: IMailerModuleOptions): DynamicModule {
		MailerModule.options = options;

		return {
			module: MailerModule,
			imports: MailerModule.getImports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: MailerModule,
			providers: [
				provideClass(
					MAILER_SERVICE,
					MailerModule.options.test ? TelegramMailerService : MailerService,
				),
			],
			imports: MailerModule.getImports(),
			exports: MailerModule.getExports(),
		};
	}
}
