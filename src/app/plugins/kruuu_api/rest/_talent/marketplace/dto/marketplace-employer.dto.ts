import { EmployerDto } from '~api/domain/employer/typing';
import { UserShortInfoDto } from '~api/domain/users/typing';
import { DtoPropertyOptional } from '~api/shared';

export class TalentMarketplaceEmployerDto extends EmployerDto {
	@DtoPropertyOptional()
	user?: UserShortInfoDto;
}
