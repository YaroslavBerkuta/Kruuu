import { Repository } from 'typeorm';
import { IProject } from '../typing';

export type IProjectsRepository = Repository<IProject>;
