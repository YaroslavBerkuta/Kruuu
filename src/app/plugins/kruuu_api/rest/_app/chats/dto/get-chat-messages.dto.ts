import { IsNumberString } from 'class-validator';
import { DtoProperty } from '~api/shared';

export class GetChatMessagesParamsDto {
	@DtoProperty()
	@IsNumberString()
	chatId: number;
}
