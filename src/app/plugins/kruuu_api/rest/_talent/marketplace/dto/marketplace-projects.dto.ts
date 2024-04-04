import { IGalleryModel } from '~api/domain/galleries/interface';
import { ProjectStatus } from '~api/domain/projects/typing/enums';
import { ITag } from '~api/domain/tags/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class MarketplaceProjectsDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	title: string;

	@DtoProperty()
	industryId: number;
	@DtoProperty()
	industry: ITag;

	@DtoProperty()
	typeId: number;
	@DtoProperty()
	type: ITag;

	@DtoProperty()
	startingDate: string;

	@DtoProperty()
	duration: string;

	@DtoProperty()
	location: string;

	@DtoProperty()
	descriptions: string;

	@DtoProperty()
	budget: string;

	@DtoPropertyOptional()
	files?: IGalleryModel[];

	@DtoProperty()
	createdAt: string;

	@DtoProperty()
	updatedAt: string;

	@DtoProperty()
	status: ProjectStatus;
}
