import { DtoProperty } from '~api/shared';
import { SocialLinkKey } from '../enums';

export class SocialLinkDto {
	@DtoProperty()
	id: number;

	@DtoProperty({}, 'exclude')
	parentType: string;

	@DtoProperty({}, 'exclude')
	parentId: number;

	@DtoProperty()
	key: SocialLinkKey;

	@DtoProperty()
	value: string;
}

export class SocialLinkResponseDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	key: SocialLinkKey;

	@DtoProperty()
	value: string;
}

export class StoreSocialLinksPayload {
	@DtoProperty({
		enum: SocialLinkKey,
	})
	key: SocialLinkKey;

	@DtoProperty()
	value: string;
}
