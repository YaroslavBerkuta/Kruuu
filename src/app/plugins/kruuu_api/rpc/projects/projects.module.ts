import { DynamicModule, Module } from '@nestjs/common';
import { ProjectsModule } from '~api/domain/projects/projects.module';
import { ApplicationModule, JobModule, UsersModule } from '~api/domain';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import {
	HandleAddTalentsEvent,
	HandleCreateProjectEvent,
	HandleUpdateProjectEvent,
} from './events';
import { RpcProjectsService } from './projects.service';

@Module({})
export class RpcRrojectsModule {
	static forRoot(): DynamicModule {
		return {
			module: RpcRrojectsModule,
			imports: [
				ProjectsModule.forFeature(),
				UsersModule.forFeature(),
				BlockchainAPIModule.forFeature(),
				JobModule.forFeature(),
				ApplicationModule.forFeature(),
			],
			providers: [
				RpcProjectsService,
				HandleCreateProjectEvent,
				HandleUpdateProjectEvent,
				HandleAddTalentsEvent,
			],
		};
	}
}
