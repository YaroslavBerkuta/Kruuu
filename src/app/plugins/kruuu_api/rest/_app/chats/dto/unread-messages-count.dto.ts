import { ApiProperty } from '@nestjs/swagger';

export class UnreadMessagesCountDto {
	@ApiProperty()
	count: number;
}
