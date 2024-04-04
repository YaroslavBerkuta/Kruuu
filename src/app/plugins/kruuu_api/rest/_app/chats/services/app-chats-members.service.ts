import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHATS_MEMBERS_REPOSITORY, IChatsMembersRepository } from '~api/domain/chats/typing';
import { DeleteChatMemberDto } from '../dto';

@Injectable()
export class AppChatsMembersService {
	@Inject(CHATS_MEMBERS_REPOSITORY) private readonly membersRepository: IChatsMembersRepository;

	public async deleteMember(userId: number, dto: DeleteChatMemberDto) {
		const member = await this.membersRepository.findOneBy({ userId, chatId: dto.chatId });
		if (!member) throw new NotFoundException('User is not chat member');

		await this.membersRepository.update(member.id, { isDeleted: true });
	}
}
