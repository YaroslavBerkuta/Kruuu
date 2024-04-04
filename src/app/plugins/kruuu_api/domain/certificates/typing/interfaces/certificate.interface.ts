import { IGalleryModel } from '~api/domain/galleries/interface';
import { IUser } from '~api/domain/users/typing';
import { Term } from '~api/shared';

export interface ICertificate {
	id: number;
	title: string;
	startDate: string;
	durationTerm?: Term;
	durationTime?: string;
	location: string;
	descriptions: string;
	userId: number;

	files?: IGalleryModel[];

	createdAt?: string;
	updatedAt?: string;
}

export interface ICerteficateToUser {
	id: number;
	certeficateId: number;
	userId: number;
	certeficate?: ICertificate;
	user?: IUser;
	createdAt?: string;
}
