import { IUser } from '~api/domain/users/typing';
import { EmployerType, FacilitiesAndServices } from '../enums';
import { ISocialLink } from '~api/domain/social/typing';
import { IApplication } from '~api/domain/applications/typing';
import { IGalleryModel } from '~api/domain/galleries/interface';

export interface IEmployerInfo {
	userId: number;
	user?: IUser;
	name: string;
	type: EmployerType;
	facilAndServ: FacilitiesAndServices;
	location?: string;
	countryCode?: string;
	established: number;
	industry: string;
	description?: string;
	mobileNumber?: string;
	email?: string;
	siupp?: string;
	owner?: string;
	npwp?: string;
	websiteName?: string;
	anotherLink?: string;
	socialMedia?: ISocialLink[];
	applications?: IApplication[];

	gallery?: IGalleryModel[];
}
