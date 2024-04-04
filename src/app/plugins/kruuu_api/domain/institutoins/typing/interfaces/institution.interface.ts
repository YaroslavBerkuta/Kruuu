import { IUser } from '~api/domain/users/typing';

export interface IInstitution {
	userId: number;

	user?: IUser;

	name?: string;
	establish?: string;
	address?: string;
	descriptions?: string;
	email?: string;
	mobileNumber?: string;
}
