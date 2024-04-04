import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobDto } from '~api/domain/jobs/dto';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import {
	GetJobsParamsDto,
	GetProjectsParamsDto,
	MarketplaceProjectsDto,
	TalentMarketplaceEmployerDto,
} from './dto';

import { TalentMarketplaceService } from './talent-marketplace.service';

@ApiTags('Talent | Marketplace')
@Controller('talent/marketplace')
export class TalentMarketplaceController {
	constructor(private readonly marketplaceService: TalentMarketplaceService) {}

	@ApiOperation({ summary: 'Get talent marketplace projects ' })
	@ApiOkResponse({
		status: 201,
		description: 'Return talent marketplace projects ',
		type: [MarketplaceProjectsDto],
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('/projects')
	public async getProjects(
		@ReqPagination() pagination: IPagination,
		@Query() dto: GetProjectsParamsDto,
	) {
		return await this.marketplaceService.getProjects(pagination, dto);
	}

	@ApiOperation({ summary: 'Get talent marketplace employers ' })
	@ApiOkResponse({
		status: 201,
		description: 'Return talent marketplace employers ',
		type: [TalentMarketplaceEmployerDto],
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('/employers')
	public async getEmployers(@ReqPagination() pagination: IPagination) {
		return await this.marketplaceService.getEmployers(pagination);
	}

	@ApiOperation({ summary: 'Get talent marketplace jobs ' })
	@ApiOkResponse({
		status: 201,
		description: 'Return talent marketplace jobs ',
		type: [JobDto],
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('/jobs')
	public async getJobs(
		@ReqUser() userId: number,
		@ReqPagination() pagination: IPagination,
		@Query() dto: GetJobsParamsDto,
	) {
		return await this.marketplaceService.getJobs(userId, pagination, dto);
	}
}
