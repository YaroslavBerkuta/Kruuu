import { Controller, Get } from '@nestjs/common';
import { InstituteTalentsService } from './institute-talents.service';
import { RoleGuard } from '~api/domain/sessions/decorators';
import { UserRole } from '~api/domain/users/typing';
import { ApiTags } from '@nestjs/swagger';
import { IPagination, ReqPagination } from '~api/shared';

@ApiTags('Institution | Talents')
@Controller('institution/talents')
export class InstituteTalentsController {
	constructor(private readonly instituteTalentsService: InstituteTalentsService) {}

	@RoleGuard(UserRole.Institut)
	@Get()
	getTalents(@ReqPagination() pagination: IPagination) {
		return this.instituteTalentsService.getTalentsList(pagination);
	}
}
