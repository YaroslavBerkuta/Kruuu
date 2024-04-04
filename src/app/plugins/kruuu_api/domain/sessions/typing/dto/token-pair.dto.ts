import { DtoProperty } from '~api/shared';

export class TokenPairDto {
	@DtoProperty()
	accessToken: string;

	@DtoProperty()
	refreshToken: string;
}
