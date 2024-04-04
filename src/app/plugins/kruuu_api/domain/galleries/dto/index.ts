import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class GalleryDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	fileUrl: string;

	@DtoProperty()
	parentTable: string;

	@DtoProperty()
	parentId: string;

	@DtoPropertyOptional()
	data?: any;

	@DtoPropertyOptional()
	fileName?: string;

	@DtoPropertyOptional()
	mimetype?: string;

	@DtoPropertyOptional()
	createdAt: string;

	@DtoPropertyOptional()
	updatedAt: string;
}
