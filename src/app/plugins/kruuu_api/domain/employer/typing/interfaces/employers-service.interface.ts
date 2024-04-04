import { IPutSocialLinksPayload } from '~api/domain/social/typing';
import { FindOptionsWhere } from 'typeorm';
import { EmployerType, FacilitiesAndServices } from '../enums';
import { IEmployerInfo } from './employer.interface';

export interface ISaveEmployerInfoPayload {
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
}

export interface IUpdateEmployerInfoPayload
	extends Partial<Omit<IEmployerInfo, 'socialMedia' | 'userId' | 'user'>> {}

export interface ISaveEmployerSocialMediaPayload {
	socialMedia?: IPutSocialLinksPayload['items'];
}

export interface IEmployersService {
	saveInfo(userId: number, payload: ISaveEmployerInfoPayload): Promise<IEmployerInfo>;
	updateInfo(userId: number, payload: IUpdateEmployerInfoPayload): Promise<IEmployerInfo>;
	saveSocialMedia(userId: number, payload: ISaveEmployerSocialMediaPayload): Promise<void>;
	getOneBy(
		where: FindOptionsWhere<IEmployerInfo> | FindOptionsWhere<IEmployerInfo>[],
	): Promise<Omit<IEmployerInfo, 'socialMedia'>>;
	getBySearchString(searchStr: string, includeIds?: number[]): Promise<IEmployerInfo[]>;
}
