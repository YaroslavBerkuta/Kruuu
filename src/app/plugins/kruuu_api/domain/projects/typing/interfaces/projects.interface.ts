import { SocialLinkKey } from '~api/domain/social/typing';
import { ProjectStatus } from '../enums';

export interface IProject {
	id: number;

	title: string;
	industryId: any;
	typeId: number;
	startingDate: string;
	duration: string;
	location: string;
	descriptions: string;
	blochaineUuid?: string;
	budget: string;
	lockedTokenBeddows?: string;
	creatorId?: number;
	uniqueKey?: string;
	status: ProjectStatus;

	meta?: {
		blockUpdatesCount?: number;
	};

	createdAt: string;
	updatedAt: string;
}

export interface IProjectsService {
	store(dto: IStoreProjectPayload): Promise<IProject>;
	update(id: number, dto: IUpdateProjectPayload): Promise<IProject>;
	delete(id: number): Promise<void>;
	storeSocial(id: number, payload: IStoreSocialProjectPayload): Promise<void>;
	close(id: number): Promise<void>;

	addUserToProject(projectId: number, userId: number): Promise<void>;
}

export interface IStoreSocialProjectPayload {
	items: { key: SocialLinkKey; value: string }[];
}
export interface IStoreProjectPayload {
	creatorId: number;
	title: string;
	industryId: number;
	typeId: number;
	startingDate: string;
	duration: string;
	location: string;
	descriptions: string;
	budget: string;
	blochaineUuid?: string;
	lockedTokenBeddows?: string;
	uniqueKey?: string;
	meta?: IProject['meta'];
}

export interface IUpdateProjectPayload {
	title?: string;
	industryId?: number;
	typeId?: number;
	startingDate?: string;
	duration?: string;
	location?: string;
	descriptions?: string;
	budget?: string;
}
