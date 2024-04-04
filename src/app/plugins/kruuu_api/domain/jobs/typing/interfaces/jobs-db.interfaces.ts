import { Repository } from 'typeorm';
import {
	IJob,
	IJobAppearance,
	IJobMeasurement,
	IJobsResidence,
	IJobsToTags,
} from './job.interface';

export type IJobRepository = Repository<IJob>;
export type IJobMeasurementRepository = Repository<IJobMeasurement>;
export type IJobAppearanceRepository = Repository<IJobAppearance>;
export type IJobToTagRepository = Repository<IJobsToTags>;
export type IJobsResidenceRepository = Repository<IJobsResidence>;
