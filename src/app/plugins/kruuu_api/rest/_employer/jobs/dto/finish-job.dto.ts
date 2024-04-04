import { DtoProperty } from '~api/shared';

export class FinishJobPayloadDto {
	@DtoProperty()
	jobId: number;
}
