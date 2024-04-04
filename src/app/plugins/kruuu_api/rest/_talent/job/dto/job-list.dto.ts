import { DtoProperty } from '~api/shared';

export class GetJobListPramDto {
	@DtoProperty()
	projectId: number;
}
