import { DynamicModule, Module } from '@nestjs/common';

import { GALLERY_REPOSITORY, GALLERY_SERVICE } from './consts';
import { Gallery } from './entities';
import { GalleryService } from './services';
import { provideEntity } from '~api/libs';
import { provideClass } from '~api/shared';

@Module({})
export class GalleryModule {
	static getProviders() {
		return [
			provideEntity(GALLERY_REPOSITORY, Gallery),
			provideClass(GALLERY_SERVICE, GalleryService),
		];
	}

	static imports() {
		return [];
	}

	static exports() {
		return [GALLERY_REPOSITORY, GALLERY_SERVICE];
	}

	static forRoot(): DynamicModule {
		return {
			module: GalleryModule,
			providers: this.getProviders(),
			imports: this.imports(),
		};
	}
	static forFeature(): DynamicModule {
		return {
			module: GalleryModule,
			imports: this.imports(),
			providers: this.getProviders(),
			exports: this.exports(),
		};
	}
}
