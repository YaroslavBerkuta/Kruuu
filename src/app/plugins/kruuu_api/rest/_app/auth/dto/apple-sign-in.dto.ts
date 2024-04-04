import { UserRole } from '~api/domain/users/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class AppleSignInPayloadDto {
	@DtoProperty()
	idToken: string;

	@DtoPropertyOptional()
	role?: UserRole;

	@DtoProperty()
	deviceName: string;

	@DtoPropertyOptional()
	email?: string;

	@DtoPropertyOptional()
	firstName?: string;

	@DtoPropertyOptional()
	lastName?: string;
}
