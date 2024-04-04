import { UserShortInfoDto } from '~api/domain/users/typing';
import { DtoProperty } from '~api/shared';

export class ChatMemberDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	chatId: number;

	@DtoProperty()
	userId: number;

	@DtoProperty()
	isDeleted: boolean;

	@DtoProperty()
	user?: UserShortInfoDto;

	@DtoProperty()
	isOnline?: boolean;

	@DtoProperty()
	createdAt: string;
}
