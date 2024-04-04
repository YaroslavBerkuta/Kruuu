import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobDto } from '~api/domain/jobs/dto';
import { ProjectsDto } from '~api/domain/projects/dto';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { EmployerMarketplaceService } from './marketplace.service';
import { TalentsListDto } from '~api/domain/talents/typing';
import { GetTalentsParamsDto } from './dto';

@ApiTags('Employer | Marketplace')
@Controller('employer/marketplace')
export class EmployerMarketplaceController {
	constructor(private readonly employerMarketplaceService: EmployerMarketplaceService) {}

	@ApiOperation({ summary: 'Get talents list for marketplaces' })
	@ApiResponse({
		status: 201,
		description: 'Return talents lst',
		type: TalentsListDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('talents')
	public getList(
		@ReqUser() userId: number,
		@ReqPagination() pagination: IPagination,
		@Query() dto: GetTalentsParamsDto,
	) {
		return this.employerMarketplaceService.getTalents(userId, pagination, dto);
	}

	@ApiOperation({ summary: 'Get employer marketplace projects ' })
	@ApiResponse({
		status: 201,
		description: 'Return employer marketplace projects ',
		type: [ProjectsDto],
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('/projects')
	public async getProjects(@ReqUser() userId: number, @ReqPagination() pagination: IPagination) {
		return await this.employerMarketplaceService.getProjects(userId, pagination);
	}

	@ApiOperation({ summary: 'Get employer marketplace jobs ' })
	@ApiResponse({
		status: 201,
		description: 'Return employer marketplace jobs ',
		type: [JobDto],
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('/jobs')
	public async getJobs(@ReqUser() userId: number, @ReqPagination() pagination: IPagination) {
		return await this.employerMarketplaceService.getJobs(userId, pagination);
	}
}
