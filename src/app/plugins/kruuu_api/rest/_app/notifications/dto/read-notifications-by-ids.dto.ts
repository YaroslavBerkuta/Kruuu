import { DtoProperty } from '~api/shared';

export class ReadNotificationsByIdsDto {
	@DtoProperty({
		isArray: true,
		type: Number,
	})
	ids: number[];
}
