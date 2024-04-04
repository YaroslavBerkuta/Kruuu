import { DynamicModule, Module } from '@nestjs/common';
import { AppWalletsService } from './wallets.service';
import { AppWalletsController } from './wallets.controller';
import { StripeModule, WalletsModule } from '~api/domain';

@Module({})
export class AppWalletsModule {
	static forRoot(): DynamicModule {
		return {
			module: AppWalletsModule,
			controllers: [AppWalletsController],
			providers: [AppWalletsService],
			imports: [WalletsModule.forFeature(), StripeModule.forFeature()],
		};
	}
}
