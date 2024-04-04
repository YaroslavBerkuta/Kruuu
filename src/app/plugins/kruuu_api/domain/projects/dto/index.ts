import { DtoProperty } from '~api/shared';

export class ProjectsDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	title: string;

	@DtoProperty()
	industryId: number;

	@DtoProperty()
	typeId: number;

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

	@DtoProperty()
	createdAt: string;

	@DtoProperty()
	updatedAt: string;
}
