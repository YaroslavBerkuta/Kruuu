import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationStatus } from '~api/domain/applications/typing';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { EmployerApplicationsService } from './applications.service';
import { GetApplicationListDto } from './dto';

@ApiTags('Employer | Applications')
@Controller('employer/application')
export class EmployerApplicationsController {
	constructor(private readonly employerApplicationService: EmployerApplicationsService) {}

	@Get()
	@ApiImplictPagination()
	@AuthGuard()
	public getList(
		@ReqUser() userId: number,
		@ReqPagination() pagination: IPagination,
		@Query() dto: GetApplicationListDto,
	) {
		return this.employerApplicationService.getList(userId, pagination, dto);
	}

	@AuthGuard()
	@Post('accept/:id')
	public acceptApplication(@ReqUser() userId: number, @Param('id') id: number) {
		return this.employerApplicationService.acceptApplication(userId, id);
	}

	@Patch(':id')
	@AuthGuard()
	public updateStatus(@Param('id') id: number, @Body('status') status: ApplicationStatus) {
		return this.employerApplicationService.updateStatus(id, status);
	}
}
