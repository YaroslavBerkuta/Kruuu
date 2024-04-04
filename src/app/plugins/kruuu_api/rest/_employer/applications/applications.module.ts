import { DynamicModule, Module } from '@nestjs/common';
import {
	ApplicationModule,
	JobModule,
	StripeModule,
	TagsModule,
	TalentsModule,
	UsersModule,
	WalletsModule,
} from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { EmployerApplicationsController } from './applications.controller';
import { EmployerApplicationsService } from './applications.service';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';

@Module({})
export class EmployerApplicationsModule {
	static forRoot(): DynamicModule {
		return {
			module: EmployerApplicationsModule,
			controllers: [EmployerApplicationsController],
			providers: [EmployerApplicationsService],
			imports: [
				ApplicationModule.forFeature(),
				GalleryModule.forFeature(),
				TagsModule.forFeature(),
				TalentsModule.forFeature(),
				StripeModule.forFeature(),
				UsersModule.forFeature(),
				JobModule.forFeature(),
				BlockchainAPIModule.forFeature(),
				WalletsModule.forFeature(),
			],
		};
	}
}
