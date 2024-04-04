import { JobAppearance } from './jobs-appearance.entity';
import { JobMeasurement } from './jobs-measurement.entity';
import { JobResidence } from './jobs-residence.entity';
import { JobToTag } from './jobs-to-tags.entity';
import { Job } from './jobs.entity';

export const JOBS_ENTITIES = [Job, JobAppearance, JobMeasurement, JobToTag, JobResidence];

export { Job, JobAppearance, JobMeasurement, JobToTag, JobResidence };
