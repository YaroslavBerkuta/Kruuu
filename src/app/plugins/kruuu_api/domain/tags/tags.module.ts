import { DynamicModule, Module } from '@nestjs/common';

import { provideClass } from '~api/shared';
import { Tag } from './entities';
import { TagsSeeder } from './seeders';
import { TagsService } from './services';
import { TAGS_REPOSITORY, TAGS_SERVICE } from './typing';
import { provideEntity } from '~api/libs';

@Module({})
export class TagsModule {
	static getProviders() {
		return [provideClass(TAGS_SERVICE, TagsService), provideEntity(TAGS_REPOSITORY, Tag)];
	}

	static getExports() {
		return [TAGS_SERVICE, TAGS_REPOSITORY];
	}

	static getImports() {
		return [];
	}

	static forRoot(): DynamicModule {
		return {
			module: TagsModule,
			providers: [...TagsModule.getProviders(), TagsSeeder],
			imports: TagsModule.getImports(),
			exports: TagsModule.getExports(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: TagsModule,
			providers: TagsModule.getProviders(),
			imports: TagsModule.getImports(),
			exports: TagsModule.getExports(),
		};
	}
}
