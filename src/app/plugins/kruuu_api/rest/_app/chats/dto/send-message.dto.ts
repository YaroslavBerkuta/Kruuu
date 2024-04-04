import { IsNumber, IsString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class SendMessagePayloadDto {
	@DtoProperty()
	@IsNumber()
	chatId: number;

	@DtoProperty()
	@IsString()
	message: string;
}
