import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationStatus } from '~api/domain/applications/typing';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { TalentApplicationService } from './applications.service';

@ApiTags('Talent | Applications')
@Controller('talent/applications')
export class TalentApplicationController {
	constructor(private readonly talentApplicationService: TalentApplicationService) {}

	@Get()
	@ApiImplictPagination()
	@AuthGuard()
	public getList(
		@ReqUser() userId: number,
		@ReqPagination() pagination: IPagination,
		@Query('status') status: ApplicationStatus,
	) {
		return this.talentApplicationService.getList(userId, pagination, status);
	}

	@Post('/request')
	@AuthGuard()
	public submitJob(@ReqUser() userId: number, @Body() dto: any) {
		return this.talentApplicationService.create(userId, dto);
	}
}
