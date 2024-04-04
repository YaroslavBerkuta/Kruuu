export interface IInstitutionService {
	saveInfo(userId: number, payload: ISaveInfo);
	updateInfo(userId: number, payload: IUpdateInfo);
}

export interface ISaveInfo {
	name: string;
	establish: string;
	address: string;
	descriptions: string;
	email: string;
	mobileNumber: string;
}

export interface IUpdateInfo {
	name?: string;
	establish?: string;
	address?: string;
	descriptions?: string;
	email?: string;
	mobileNumber?: string;
}
