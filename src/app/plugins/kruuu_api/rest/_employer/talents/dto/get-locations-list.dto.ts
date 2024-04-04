import { DtoProperty } from '~api/shared';

export class LocationsListRespDto {
	@DtoProperty({
		isArray: true,
		type: String,
	})
	items: string[];

	@DtoProperty()
	count: number;
}
