import { DynamicModule, Module } from '@nestjs/common';
import { SocialLink } from './entities';
import { SocialLinksService } from './services/social-links.service';
import { SOCIAL_LINKS_REPOSITORY, SOCIAL_LINKS_SERVICE } from './typing/consts';
import { provideEntity } from '~api/libs';
import { provideClass } from '~api/shared';

@Module({})
export class SocialModule {
	private static getProviders() {
		return [
			provideEntity(SOCIAL_LINKS_REPOSITORY, SocialLink),
			provideClass(SOCIAL_LINKS_SERVICE, SocialLinksService),
		];
	}
	static forRoot(): DynamicModule {
		return {
			module: SocialModule,
			providers: this.getProviders(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: SocialModule,
			providers: this.getProviders(),
			exports: [SOCIAL_LINKS_SERVICE],
		};
	}
}
