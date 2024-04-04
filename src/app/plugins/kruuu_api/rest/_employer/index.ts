import { EmployerAccountModule } from './account/employer-account.module';
import { EmployerApplicationsModule } from './applications/applications.module';
import { EmployerJobsModule } from './jobs/employer-jobs.module';
import { EmployerMarketplaceModule } from './marketplace/marketplace.module';
import { EmployerProjectsModule } from './projects/employers-projects.module';
import { EmployerTalentsModule } from './talents/employer-talents.module';

export const getRestEmployerModules = () => [
	EmployerAccountModule.forRoot(),
	EmployerTalentsModule.forRoot(),
	EmployerProjectsModule.forRoot(),
	EmployerJobsModule.forRoot(),
	EmployerMarketplaceModule.forRoot(),
	EmployerApplicationsModule.forRoot(),
];
