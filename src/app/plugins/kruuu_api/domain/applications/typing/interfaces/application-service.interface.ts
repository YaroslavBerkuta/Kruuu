import { UpdateResult } from 'typeorm';
import { ApplicationStatus } from '../enums';
import { IApplication } from './applications.interface';

export interface IApplicationService {
	create(payload: IStoreApplicationPayload): Promise<IApplication>;
	updateStatus(payload: IUpdateApplicationPayload): Promise<UpdateResult>;
}

export interface IStoreApplicationPayload {
	talentId: number;
	jobId: number;
}

export interface IUpdateApplicationPayload {
	status: ApplicationStatus;
	applicationId: number;
}
