import { INDUSTRY_JOBS } from './industry-jobs';
import { INDUSTRY_PROJECT } from './industry-project';
import { JOB } from './job';
import { JOB_TYPE_JOBS } from './job-type-jobs';
import { JOB_TYPE_PROJECT } from './job-type-project';
import { NATIONALITY } from './nationality';
import { OCCUPATIONS } from './occupations';
import { SKILLS } from './skills';

export const TAGS_REPOSITORY = Symbol('TAGS_REPOSITORY');

export const TAGS_SERVICE = Symbol('TAGS_SERVICE');

export const TAGS_SEED_ENTITIES = [
	...INDUSTRY_PROJECT,
	...INDUSTRY_JOBS,
	...OCCUPATIONS,
	...SKILLS,
	...NATIONALITY,
	...JOB_TYPE_PROJECT,
	...JOB_TYPE_JOBS,
	...JOB,
];
