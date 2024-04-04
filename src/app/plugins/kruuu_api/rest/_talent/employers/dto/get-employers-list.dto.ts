import { EmployerDto } from '~api/domain/employer/typing';
import { DtoProperty } from '~api/shared';

export class GetEmployersListResponseDto {
	@DtoProperty({
		isArray: true,
		type: EmployerDto,
	})
	items: EmployerDto[];

	@DtoProperty()
	count: number;
}
