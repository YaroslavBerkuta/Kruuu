import { DtoProperty } from '~api/shared';

export class ChatMessageDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	chatId: number;

	@DtoProperty()
	userId: number;

	@DtoProperty()
	content: string;

	@DtoProperty()
	isRead: boolean;

	@DtoProperty()
	createdAt: string;
}

export class ChatMessagesListDto {
	@DtoProperty({
		isArray: true,
		type: ChatMessageDto,
	})
	items: ChatMessageDto[];

	@DtoProperty()
	count: number;
}
