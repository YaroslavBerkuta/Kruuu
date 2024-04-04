import { DtoPropertyOptional } from '~api/shared';

export class DeleteChatMemberDto {
	@DtoPropertyOptional()
	chatId: number;
}
