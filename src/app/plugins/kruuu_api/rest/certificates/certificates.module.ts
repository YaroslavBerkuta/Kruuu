import { DynamicModule, Module } from '@nestjs/common';

import { CertificationsModule, InstitutionModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';
import { RestCertificatesService } from './certificates.service';
import { RestCertificatesController } from './certificates.controller';

@Module({})
export class RestCertificatesModule {
	static forRoot(): DynamicModule {
		return {
			module: RestCertificatesModule,
			providers: [RestCertificatesService],
			controllers: [RestCertificatesController],
			imports: [
				CertificationsModule.forFeature(),
				GalleryModule.forFeature(),
				InstitutionModule.forFeature(),
			],
		};
	}
}
