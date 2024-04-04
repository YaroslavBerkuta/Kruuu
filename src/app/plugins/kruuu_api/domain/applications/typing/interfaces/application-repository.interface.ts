import { Repository } from 'typeorm';
import { IApplication } from './applications.interface';

export type IApplicationRepository = Repository<IApplication>;
