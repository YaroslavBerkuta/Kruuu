import { DtoProperty } from '~api/shared';
import { TagCategory } from '../enums';

export class TagDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	name: string;

	@DtoProperty({}, 'exclude')
	key: string;

	@DtoProperty({}, 'exclude')
	parentId: number;

	@DtoProperty({ enum: TagCategory }, 'exclude')
	category: TagCategory;

	@DtoProperty({}, 'exclude')
	authorId: number;

	@DtoProperty({}, 'exclude')
	isCustom: boolean;

	// @DtoPropertyOptional({ isArray: true, type: TagDto })
	// children: TagDto[]
}

export class TagResponseDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	name: string;
}
