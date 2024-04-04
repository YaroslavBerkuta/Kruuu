import { JobDto } from '~api/domain/jobs/dto';
import { DtoProperty } from '~api/shared';

export class GetJobList {
	@DtoProperty({ isArray: true, type: JobDto })
	items: JobDto[];

	@DtoProperty()
	count: number;
}
