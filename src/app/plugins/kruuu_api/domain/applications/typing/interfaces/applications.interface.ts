import { IJob } from '~api/domain/jobs/typing';
import { ApplicationStatus } from '../enums';
import { ITalentInfo } from '~api/domain/talents/typing';
import { IProject } from '~api/domain/projects/typing';
import { IEmployerInfo } from '~api/domain/employer/typing';

export interface IApplication {
	id: number;

	status: ApplicationStatus;
	talentId: number;
	jobId: number;
	employerId: number;

	job?: IJob;
	talent?: ITalentInfo;
	project?: IProject;
	employer?: IEmployerInfo;

	createdAt: string;
	updatedAt: string;
}
