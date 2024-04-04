import { InstitutionAccountModule } from './account/institution-account.module';
import { InstituteCertificatesModule } from './certificates/institution-certificates.module';
import { InstituteTalentsModule } from './talents/institute-talents.module';

export const getRestInstitutionModule = () => [
	InstitutionAccountModule.forRoot(),
	InstituteCertificatesModule.forRoot(),
	InstituteTalentsModule.forRoot(),
];
