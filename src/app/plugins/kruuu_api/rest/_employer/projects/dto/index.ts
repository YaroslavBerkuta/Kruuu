import { StoreSocialLinksPayload } from '~api/domain/social/typing';
import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class StoreProjectsPayloadDto {
	@DtoProperty()
	title: string;

	@DtoProperty()
	industryId: number;

	@DtoProperty()
	typeId: number;

	@DtoProperty()
	startingDate: string;

	@DtoProperty()
	duration: string;

	@DtoProperty()
	location: string;

	@DtoProperty()
	descriptions: string;

	@DtoProperty()
	budget: string;

	@DtoPropertyOptional()
	uniqueKey: string;
}

export class UpdateProjectsPayloadDto {
	@DtoPropertyOptional()
	title?: string;

	@DtoPropertyOptional()
	industryId?: number;

	@DtoPropertyOptional()
	typeId?: number;

	@DtoPropertyOptional()
	startingDate?: string;

	@DtoPropertyOptional()
	duration?: string;

	@DtoPropertyOptional()
	location?: string;

	@DtoPropertyOptional()
	descriptions?: string;

	@DtoPropertyOptional()
	budget?: string;
}

export class StoreProjectSocialDto {
	@DtoProperty({ isArray: true, type: StoreSocialLinksPayload })
	items: StoreSocialLinksPayload[];
}
