import { Controller, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ReqUser } from '~api/shared';
import { DeleteChatMemberDto } from '../dto';
import { AppChatsMembersService } from '../services';

@ApiTags('App | Chats members')
@Controller('app/chats-members')
export class AppChatsMembersController {
	constructor(private readonly chatsMembersService: AppChatsMembersService) {}

	@ApiOperation({ summary: 'Delete from chat chat members' })
	@ApiBody({ type: DeleteChatMemberDto })
	@ApiOkResponse({ description: 'Delete member from chat (chat remain)' })
	@AuthGuard()
	@Delete()
	public async deleteMessage(@ReqUser() userId: number, @Query() dto: DeleteChatMemberDto) {
		return await this.chatsMembersService.deleteMember(userId, dto);
	}
}
