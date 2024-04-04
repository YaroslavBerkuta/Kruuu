import { TagCategory } from '../enums';
import { ITag } from './tag.interface';

export interface IStoreTagPayload {
	name: string;
	key?: string;
	parentId?: number;
	parentKey?: string;
	category: TagCategory;
	authorId?: number;
	isCustom?: boolean;
}

export interface IGetTagsListParams {
	userId?: number;
	category?: TagCategory;
	searchString?: string;
	parentId?: number;
}

export interface ITagsService {
	store(payload: IStoreTagPayload): Promise<ITag>;
	getList(params: IGetTagsListParams): Promise<ITag[]>;
	getTreeLikeListOfAll(parentId?: number): Promise<ITag[]>;
	getAllChildren(id: number): Promise<ITag[]>;
	getByIds(ids: number[]): Promise<ITag[]>;
}
