import { DynamicModule, Module } from '@nestjs/common';
import { CertificationsModule, TalentsModule, UsersModule } from '~api/domain';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';
import { CertificatesEventsListener } from './certificates.events-listener';

@Module({})
export class RpcCertificatesModule {
	static forRoot(): DynamicModule {
		return {
			module: RpcCertificatesModule,
			imports: [
				BlockchainAPIModule.forFeature(),
				TalentsModule.forFeature(),
				UsersModule.forFeature(),
				CertificationsModule.forFeature(),
			],
			providers: [CertificatesEventsListener],
		};
	}
}
