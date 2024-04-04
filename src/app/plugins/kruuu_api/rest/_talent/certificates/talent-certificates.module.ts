import { DynamicModule, Module } from '@nestjs/common';
import { TalentCertificatesService } from './talent-certificates.service';
import { TalentCertificatesController } from './talent-certificates.controller';
import { CertificationsModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';

@Module({})
export class TalentCertificatesModule {
	static forRoot(): DynamicModule {
		return {
			module: TalentCertificatesModule,
			providers: [TalentCertificatesService],
			controllers: [TalentCertificatesController],
			imports: [CertificationsModule.forFeature(), GalleryModule.forFeature()],
		};
	}
}
