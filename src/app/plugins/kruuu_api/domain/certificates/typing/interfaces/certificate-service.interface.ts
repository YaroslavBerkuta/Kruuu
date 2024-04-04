import { Term } from '~api/shared';
import { ICertificate } from './certificate.interface';

export interface ICertificatesService {
	create(payload: ICreateCertificatePayload): Promise<ICertificate>;
	certifyUser(payload: ICertifyUserPayload): Promise<void>;
}

export interface ICreateCertificatePayload {
	title: string;
	startDate: string;
	durationTime?: string;
	durationTerm?: Term;
	location: string;
	descriptions: string;
	userId: number;
}

export interface ICertifyUserPayload {
	certeficateId: number;
	userId: number;
}
