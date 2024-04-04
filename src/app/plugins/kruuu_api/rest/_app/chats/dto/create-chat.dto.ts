import { IsNumber, IsString } from 'class-validator';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class CreateChatPayloadDto {
	@DtoProperty()
	@IsNumber()
	userId: number;

	@DtoPropertyOptional()
	@IsString()
	message: string;
}
