import { Repository } from 'typeorm';
import { IEmployerInfo } from './employer.interface';

export type IEmployersInfoRepository = Repository<IEmployerInfo>;
