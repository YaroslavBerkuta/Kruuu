import { DtoProperty } from '~api/shared';

export class SaveTalentSkillsPayloadDto {
	@DtoProperty({
		isArray: true,
		type: Number,
	})
	skillTagIds: number[];
}
