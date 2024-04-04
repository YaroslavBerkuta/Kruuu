import { DynamicModule, Module } from '@nestjs/common';
import { CertificationsModule, TagsModule, TalentsModule, UsersModule } from '~api/domain';
import { InstituteCertificatesController } from './institution-certificates.controller';
import { InstituteCertificatesService } from './institution-certificates.service';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { BlockchainAPIModule } from '~api/libs/blockchain/blockchain.module';

@Module({})
export class InstituteCertificatesModule {
	static forRoot(): DynamicModule {
		return {
			module: InstituteCertificatesModule,
			controllers: [InstituteCertificatesController],
			providers: [InstituteCertificatesService],
			imports: [
				CertificationsModule.forFeature(),
				GalleryModule.forFeature(),
				TalentsModule.forFeature(),
				TagsModule.forFeature(),
				UsersModule.forFeature(),
				BlockchainAPIModule.forFeature(),
			],
		};
	}
}
