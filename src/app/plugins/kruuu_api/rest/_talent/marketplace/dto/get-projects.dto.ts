import { IsNumberString } from 'class-validator';
import { DtoPropertyOptional } from '~api/shared';

export class GetProjectsParamsDto {
	@DtoPropertyOptional()
	@IsNumberString()
	employerId?: number;
}
