import { TalentAccountModule } from './account/talent-account.module';
import { TalentApplicationModule } from './applications/applications.module';
import { TalentCertificatesModule } from './certificates/talent-certificates.module';
import { TalentEmployersModule } from './employers/talent-employers.module';
import { TalentJobModule } from './job/talent-job.module';
import { TalentMarketplaceModule } from './marketplace/talent-marketplace.module';

export const getRestTalentModules = () => [
	TalentAccountModule.forRoot(),
	TalentEmployersModule.forRoot(),
	TalentMarketplaceModule.forRoot(),
	TalentApplicationModule.forRoot(),
	TalentJobModule.forRoot(),
	TalentCertificatesModule.forRoot(),
];
