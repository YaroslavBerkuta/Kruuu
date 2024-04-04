import { Repository } from 'typeorm';
import { IInstitution } from './institution.interface';

export type TInstitutionRepository = Repository<IInstitution>;
