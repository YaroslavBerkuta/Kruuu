import { DynamicModule, Module } from '@nestjs/common';
import { provideEntity } from '~api/libs';
import {
	CERTEFICATE_TO_USER_REPOSITORY,
	CERTEFICATES_REPOSITORY,
	CERTEFICATES_SERVICES,
} from './typing';
import { CerteficateToUser, Certificate } from './entities';
import { provideClass } from '~api/shared';
import { CertificatesService } from './services/certificates.service';

@Module({})
export class CertificationsModule {
	static getProviders() {
		return [
			provideEntity(CERTEFICATES_REPOSITORY, Certificate),
			provideEntity(CERTEFICATE_TO_USER_REPOSITORY, CerteficateToUser),
			provideClass(CERTEFICATES_SERVICES, CertificatesService),
		];
	}

	static imports() {
		return [];
	}

	static forRoot(): DynamicModule {
		return {
			module: CertificationsModule,
			providers: this.getProviders(),
			imports: [],
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: CertificationsModule,
			providers: this.getProviders(),
			exports: [CERTEFICATES_SERVICES, CERTEFICATES_REPOSITORY, CERTEFICATE_TO_USER_REPOSITORY],
		};
	}
}
