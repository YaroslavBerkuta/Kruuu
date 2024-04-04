import { DtoProperty, DtoPropertyOptional } from '~api/shared';
import { ChatMemberDto } from './chat-member.dto';
import { ChatMessageDto } from './chat-message.dto';

export class ChatDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	lastMessageDate: string;

	@DtoProperty()
	createdAt: string;
}

export class ChatResponseDto extends ChatDto {
	@DtoProperty()
	lastMessage: ChatMessageDto;

	@DtoPropertyOptional({ type: Number })
	unreadMessagesCount?: number;

	@DtoPropertyOptional()
	otherMember: ChatMemberDto;

	@DtoPropertyOptional({ type: Number })
	firstMessageId: number;

	@DtoPropertyOptional({ type: Number })
	lastMessageId: number;
}

export class ChatDetailsDto extends ChatDto {
	@DtoProperty()
	otherMember: ChatMemberDto;

	@DtoPropertyOptional()
	unreadMessagesCount?: number;

	@DtoPropertyOptional()
	firstMessageId: number;

	@DtoPropertyOptional()
	lastMessageId: number;
}

export class ChatsListDto {
	@DtoProperty({
		isArray: true,
		type: ChatResponseDto,
	})
	items: ChatResponseDto[];

	@DtoProperty()
	count: number;
}
