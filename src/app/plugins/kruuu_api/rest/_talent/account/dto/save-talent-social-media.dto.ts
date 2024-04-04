import { StoreSocialLinksPayload } from '~api/domain/social/typing';
import { DtoProperty } from '~api/shared';

export class SaveTalentSocialMediaPayloadDto {
	@DtoProperty({
		isArray: true,
		type: StoreSocialLinksPayload,
	})
	socialMedia: StoreSocialLinksPayload[];
}
