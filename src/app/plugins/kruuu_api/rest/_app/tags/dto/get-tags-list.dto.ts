import { IsString } from 'class-validator';
import { TagCategory } from '~api/domain/tags/typing';
import { DtoPropertyOptional } from '~api/shared';

export class GetTagsListParamsDto {
	@DtoPropertyOptional({ enum: TagCategory })
	category?: TagCategory;

	@DtoPropertyOptional()
	@IsString()
	searchString?: string;

	@DtoPropertyOptional()
	parentId?: number;
}
