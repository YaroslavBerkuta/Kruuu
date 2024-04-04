import { DynamicModule, Module } from '@nestjs/common';
import { GalleryModule } from '~api/domain/galleries/gallery.module';

import { FilesStoreAccessService } from './files-store-access.service';
import { FilesStoreController } from './files-store.controller';
import { FilesStoreService } from './files-store.service';
import { FilesStorageModule, JwtModule, RedisModule } from '~api/libs';

@Module({})
export class FilesStoreModule {
	static forRoot(): DynamicModule {
		return {
			module: FilesStoreModule,
			controllers: [FilesStoreController],
			providers: [FilesStoreService, FilesStoreAccessService],
			imports: [
				FilesStorageModule.forFeature(),
				RedisModule.forFeature(),
				GalleryModule.forFeature(),
				JwtModule.forFeature(),
			],
		};
	}
}
