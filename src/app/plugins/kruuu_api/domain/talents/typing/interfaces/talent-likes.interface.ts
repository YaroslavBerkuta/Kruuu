import { ITalentInfo } from './talent.interface';

export interface ITalentLike {
	id: number;

	employerId: number;
	talentId: number;

	talent?: ITalentInfo;

	createDate?: string;
}
