import { DtoProperty, DtoPropertyOptional } from '~api/shared';
import { UserRole } from '../enums';

export class UserShortInfoDto {
	@DtoProperty()
	userId: number;

	@DtoPropertyOptional({ enum: UserRole })
	role?: UserRole;

	@DtoPropertyOptional()
	name?: string;

	@DtoPropertyOptional()
	avatarUrl?: string;
}
