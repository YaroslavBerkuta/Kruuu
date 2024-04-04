import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobDto } from '~api/domain/jobs/dto';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { GetJobList, StoreJobDto, UpdateJobDto } from './dto';
import { EmployerJobsService } from './employer-jobs.service';
import { FinishJobPayloadDto } from './dto/finish-job.dto';

@ApiTags('Employer | Job')
@Controller('employer/job')
export class EmployerJobsController {
	constructor(private readonly employerJobsService: EmployerJobsService) {}

	@ApiOperation({ summary: 'Employer store job' })
	@ApiBody({ type: StoreJobDto })
	@ApiResponse({
		status: 201,
		description: 'Create job',
		type: JobDto,
	})
	@AuthGuard()
	@Post()
	public store(@ReqUser() userId: number, @Body() dto: any) {
		return this.employerJobsService.store(userId, dto);
	}

	@Get()
	@ApiResponse({
		status: 200,
		description: 'Get all jobs',
		type: GetJobList,
	})
	@AuthGuard()
	@ApiImplictPagination()
	public getList(
		@ReqUser() id: number,
		@ReqPagination() pagination: IPagination,
		@Query('projectId') projectId: number,
	) {
		return this.employerJobsService.getList(id, pagination, projectId);
	}

	@ApiOperation({ summary: 'Employer get job' })
	@ApiResponse({
		status: 201,
		description: 'Return job by id',
		type: JobDto,
	})
	@AuthGuard()
	@Patch('finish')
	public finish(@Body() dto: FinishJobPayloadDto, @ReqUser() userId: number) {
		return this.employerJobsService.finishJob(userId, dto);
	}

	@ApiOperation({ summary: 'Employer update job' })
	@ApiBody({ type: UpdateJobDto })
	@ApiResponse({
		status: 201,
		description: 'Update job by id',
		type: JobDto,
	})
	@AuthGuard()
	@Patch(':id')
	public update(@Param('id') id: number, @Body() dto: UpdateJobDto) {
		return this.employerJobsService.update(id, dto);
	}

	@ApiOperation({ summary: 'Delete job' })
	@ApiResponse({
		status: 201,
	})
	@AuthGuard()
	@Delete(':id')
	public remove(@Param('id') id: number) {
		return this.employerJobsService.remove(id);
	}

	@ApiOperation({ summary: 'Employer get job' })
	@ApiResponse({
		status: 201,
		description: 'Return job by id',
		type: JobDto,
	})
	@AuthGuard()
	@Get(':id')
	public getOne(@Param('id') id: number) {
		return this.employerJobsService.getOne(id);
	}
}
