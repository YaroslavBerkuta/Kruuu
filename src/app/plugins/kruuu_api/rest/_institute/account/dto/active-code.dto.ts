import { ActivatedCodeType } from '~api/domain/users/typing';
import { DtoProperty } from '~api/shared';

export class ActiveCodeDto {
	@DtoProperty()
	code: string;

	@DtoProperty({ type: String, enum: ActivatedCodeType, default: ActivatedCodeType.Institute })
	type: ActivatedCodeType;
}
