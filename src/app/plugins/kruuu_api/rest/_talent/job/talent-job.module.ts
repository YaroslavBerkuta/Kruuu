import { DynamicModule, Module } from '@nestjs/common';
import { ApplicationModule, JobModule, TagsModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { TalentJobController } from './talent-job.controller';
import { TalentJobService } from './talent-job.service';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';

@Module({})
export class TalentJobModule {
	static forRoot(): DynamicModule {
		return {
			module: TalentJobModule,
			controllers: [TalentJobController],
			providers: [TalentJobService],
			imports: [
				JobModule.forFeature(),
				TagsModule.forFeature(),
				GalleryModule.forFeature(),
				ApplicationModule.forFeature(),
				BlockchainAPIModule.forFeature(),
			],
		};
	}
}
