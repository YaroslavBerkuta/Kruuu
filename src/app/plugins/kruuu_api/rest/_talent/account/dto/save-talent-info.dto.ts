import { IsNumber, IsString } from 'class-validator';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class SaveTalentInfoPayloadDto {
	@DtoProperty()
	@IsString()
	name: string;

	@DtoProperty()
	@IsNumber()
	mainOccupTagId: number;

	@DtoPropertyOptional()
	@IsNumber()
	secondOccupTagId?: number;

	@DtoPropertyOptional()
	@IsString()
	representative?: string;
}
