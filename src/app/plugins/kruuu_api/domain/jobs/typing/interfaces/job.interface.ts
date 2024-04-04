import { IProject } from '~api/domain/projects/typing';
import { Currency } from '~api/domain/wallets/typing';
import { JobStatus } from '../enums';

export interface IJobsResidence {
	id: number;
	nationality: string;
	residence: string;
	jobId: number;
	createdAt: string;
	updatedAt: string;
}

export interface IJobMeasurement {
	id: number;
	top: string;
	trousers: string;
	shoes: string;
	jobId: number;
	job?: IJob;
	createdAt: string;
	updatedAt: string;
}

export interface IStoreJobMeasurementPayload {
	top: string;
	trousers: string;
	shoes: string;
	jobId?: number;
}

export interface IUpdateJobMeasurementPayload {
	top?: string;
	trousers?: string;
	shoes?: string;
}

export interface IJobAppearance {
	id: number;
	bodyType: string;
	height: string;
	ethnic: string;
	eyeColor: string;
	hairLength: string;
	hairColor: string;
	jobId: number;
	job?: IJob;
	createdAt: string;
	updatedAt: string;
}

export interface IStoreJobAppearancePayload {
	bodyType: string;
	height: string;
	ethnic: string;
	eyeColor: string;
	hairLength: string;
	hairColor: string;
	jobId?: number;
}

export interface IUpdateJobAppearancePayload {
	bodyType?: string;
	height?: string;
	ethnic?: string;
	eyeColor?: string;
	hairLength?: string;
	hairColor?: string;
}

export interface IJob {
	id: number;
	projectId: number;
	title: string;
	industry: number;
	type: number;
	job: any;
	peopleNeeded: string;
	experience: string;
	startingDate: string;
	duration: string;
	location: string;
	description: string;
	payment: string;
	blochaineUuid?: string;
	currency: Currency;
	appearance: IJobAppearance;
	measurement: IJobMeasurement;
	residence?: IJobsResidence;
	project?: IProject;
	skills?: IJobsToTags[];
	image?: string;
	createdAt: string;
	updatedAt: string;

	uniqueKey?: string;

	status: JobStatus;
}

export interface IJobService {
	storeJob(payload: IJobsStorePayload): Promise<IJob>;
	deleteJob(id: number): Promise<void>;
	updateJob(id: number, payload: IJobUpdatePayload): Promise<IJob>;
	getOneJob(id: number): Promise<IJob>;
	changeStatus(id: number, status: JobStatus.InProgress | JobStatus.Finished): Promise<void>;
}

export interface IJobsStorePayload {
	title: string;
	projectId: number;
	industry: number;
	type?: number;
	job: number;
	peopleNeeded: string;
	experience: string;
	startingDate: string;
	duration: string;
	location: string;
	description: string;
	payment: string;
	currency: Currency;
	appearance?: IStoreJobAppearancePayload;
	measurement?: IStoreJobMeasurementPayload;
	skills?: number[];
	blochaineUuid?: string;
	uniqueKey?: string;
	residence?: {
		nationality: string;
		residence: string;
	};
}

export interface IJobUpdatePayload {
	title?: string;
	industry?: number;
	type?: number;
	job?: number;
	peopleNeeded?: string;
	experience?: string;
	startingDate?: string;
	duration?: string;
	location?: string;
	description?: string;
	payment?: string;
	currency?: Currency;
	appearance?: IUpdateJobAppearancePayload;
	measurement?: IUpdateJobMeasurementPayload;
	skills?: number[];
	residence?: {
		nationality?: string;
		residence?: string;
	};
}

export interface IJobsToTags {
	id: number;
	jobId: number;
	tagId: number;
	createdAt: string;
	updatedAt: string;
}
