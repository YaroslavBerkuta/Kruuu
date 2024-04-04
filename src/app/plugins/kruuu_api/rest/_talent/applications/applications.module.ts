import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationModule, JobModule, TagsModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { TalentApplicationController } from './applications.controller';
import { TalentApplicationService } from './applications.service';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';

@Module({})
export class TalentApplicationModule {
	static forRoot(): DynamicModule {
		return {
			module: TalentApplicationModule,
			controllers: [TalentApplicationController],
			providers: [TalentApplicationService],
			imports: [
				ApplicationModule.forFeature(),
				GalleryModule.forFeature(),
				TagsModule.forFeature(),
				JobModule.forFeature(),
				BlockchainAPIModule.forFeature(),
			],
		};
	}
}
