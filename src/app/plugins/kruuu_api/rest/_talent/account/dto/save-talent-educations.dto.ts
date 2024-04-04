import { TalentEducationDto } from '~api/domain/talents/typing';
import { DtoProperty } from '~api/shared';

export class SaveTalentEducationPayloadDto {
	@DtoProperty({
		isArray: true,
		type: TalentEducationDto,
	})
	educations: TalentEducationDto[];
}
