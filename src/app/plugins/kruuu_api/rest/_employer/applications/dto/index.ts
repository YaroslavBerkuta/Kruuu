import { ApplicationStatus } from '~api/domain/applications/typing';
import { DtoPropertyOptional } from '~api/shared';

export class GetApplicationListDto {
	@DtoPropertyOptional()
	status?: ApplicationStatus;

	@DtoPropertyOptional()
	projectId?: number;
}
