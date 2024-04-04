import { StoreSocialLinksPayload } from '~api/domain/social/typing';
import { DtoProperty } from '~api/shared';

export class SaveEmployerSocialMediaPayloadDto {
	@DtoProperty({
		isArray: true,
		type: StoreSocialLinksPayload,
	})
	socialMedia: StoreSocialLinksPayload[];
}
