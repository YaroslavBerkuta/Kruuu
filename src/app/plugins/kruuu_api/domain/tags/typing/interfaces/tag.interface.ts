import { TagCategory } from '../enums';

export interface ITag {
	id: number;
	name: string;
	key?: string;
	parentId?: number;
	category: TagCategory;
	authorId?: number;
	isCustom?: boolean;
	children?: ITag[];
}
