import { Repository } from 'typeorm';
import { ICerteficateToUser, ICertificate } from './certificate.interface';

export type ICertificatesRepository = Repository<ICertificate>;
export type ICerteficatesToUserRepository = Repository<ICerteficateToUser>;
