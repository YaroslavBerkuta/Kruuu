import { IsString } from 'class-validator';
import { TokenPairDto } from '~api/domain/sessions/typing';
import { UserRole } from '~api/domain/users/typing';
import { DtoProperty } from '~api/shared';

export class CreateUserPayloadDto {
	@DtoProperty()
	@IsString()
	code: string;

	@DtoProperty()
	@IsString()
	email: string;

	@DtoProperty()
	@IsString()
	password: string;

	@DtoProperty({ enum: UserRole })
	role: UserRole;

	@DtoProperty()
	@IsString()
	deviceName?: string;
}

export class CreateUserResponseDto extends TokenPairDto {
	@DtoProperty()
	userId: number;
}
