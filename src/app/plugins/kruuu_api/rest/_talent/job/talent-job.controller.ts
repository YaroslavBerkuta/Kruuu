import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { GetJobListPramDto, LocationsListRespDto } from './dto';
import { TalentJobService } from './talent-job.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Talent | Job')
@Controller('talent/job')
export class TalentJobController {
	constructor(private readonly talentJobService: TalentJobService) {}

	@ApiOperation({ summary: 'Get jobs locations list' })
	@ApiOkResponse({
		description: 'Return jobs locations list with count',
		type: LocationsListRespDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('locations')
	public async getLocationsList(@ReqPagination() pagination: IPagination) {
		return await this.talentJobService.getJobsLocations(pagination);
	}

	@AuthGuard()
	@Get()
	public list(
		@ReqUser() userId: number,
		@ReqPagination() pagination: IPagination,
		@Query() dto: GetJobListPramDto,
	) {
		return this.talentJobService.list(userId, pagination, dto);
	}

	@AuthGuard()
	@Get(':id')
	public getJob(@ReqUser() userId: number, @Param('id') id: number) {
		return this.talentJobService.getJob(id, userId);
	}
}
