import { IsNumber, IsString } from 'class-validator';
import { TagCategory } from '~api/domain/tags/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class StoreTagPayloadDto {
	@DtoProperty()
	@IsString()
	name: string;

	@DtoPropertyOptional()
	@IsString()
	key?: string;

	@DtoPropertyOptional()
	@IsNumber()
	parentId?: number;

	@DtoProperty({ enum: TagCategory })
	category: TagCategory;
}
