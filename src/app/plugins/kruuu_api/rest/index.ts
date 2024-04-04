import { getRestAppModules } from './_app';
import { getRestEmployerModules } from './_employer';
import { getRestInstitutionModule } from './_institute';
import { getRestTalentModules } from './_talent';
import { RestCertificatesModule } from './certificates/certificates.module';
import { FilesStoreModule } from './files-store/files-store.module';

export const getRestModules = () => [
	...getRestAppModules(),
	...getRestTalentModules(),
	...getRestEmployerModules(),
	...getRestInstitutionModule(),
	FilesStoreModule.forRoot(),
	RestCertificatesModule.forRoot(),
];
