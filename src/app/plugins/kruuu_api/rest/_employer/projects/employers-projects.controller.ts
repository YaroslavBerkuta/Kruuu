import {
	Body,
	Controller,
	Delete,
	Get,
	NotImplementedException,
	Param,
	Patch,
	Post,
	Put,
	Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectsDto } from '~api/domain/projects/dto';
import { AuthGuard } from '~api/domain/sessions/decorators';

import { StoreProjectSocialDto, StoreProjectsPayloadDto, UpdateProjectsPayloadDto } from './dto';
import { IPagination, ReqPagination, ReqUser } from '~api/shared';
import { EmployerProjectsService } from './employers-projects.service';

@ApiTags('Employers | Projects')
@Controller('employer/projects')
export class EmployerProjectsController {
	constructor(private readonly employerProjectsService: EmployerProjectsService) {}

	@ApiOperation({ summary: 'Projects List' })
	@ApiResponse({
		status: 201,
		description: 'return projects list',
		type: [ProjectsDto],
	})
	@AuthGuard()
	@Get()
	public list(
		@ReqUser() userId: number,
		@ReqPagination() pagination: IPagination,
		@Query('employerId') employerId?: number,
	) {
		return this.employerProjectsService.list(userId, pagination, employerId);
	}

	@ApiOperation({ summary: 'Close project' })
	@ApiResponse({
		status: 200,
	})
	@AuthGuard()
	@Patch(':id/close')
	public close(@ReqUser() userId: number, @Param('id') id: number) {
		return this.employerProjectsService.close(userId, id);
	}

	@ApiOperation({ summary: 'Store projects' })
	@ApiResponse({
		status: 201,
		description: 'return new projects',
		type: ProjectsDto,
	})
	@AuthGuard()
	@Post()
	public create(@ReqUser() userId: number, @Body() payload: StoreProjectsPayloadDto) {
		return this.employerProjectsService.create(userId, payload);
	}

	@ApiOperation({ summary: 'Get project' })
	@ApiResponse({
		status: 201,
		description: 'return one project by id',
		type: ProjectsDto,
	})
	@Get(':id')
	public getOne(@Param('id') id: number) {
		return this.employerProjectsService.getOne(id);
	}

	@Get('social/:id')
	public getSocial(@Param('id') id: number) {
		return this.employerProjectsService.getSocial(id);
	}

	@ApiOperation({ summary: 'Delete project' })
	@ApiResponse({
		status: 201,
		description: 'Delete one project by id',
	})
	@Delete(':id')
	public delete(@Param('id') id: number) {
		throw new NotImplementedException();
		return this.employerProjectsService.delete(id);
	}

	@ApiOperation({ summary: 'Update project' })
	@ApiResponse({
		status: 201,
		description: 'Update one project by id',
		type: ProjectsDto,
	})
	@Patch(':id')
	public update(
		@ReqUser() userId: number,
		@Param('id') id: number,
		@Body() payload: UpdateProjectsPayloadDto,
	) {
		return this.employerProjectsService.update(userId, id, payload);
	}

	@Put('social/:id')
	public storeSocial(@Param('id') id: number, @Body() payload: StoreProjectSocialDto) {
		return this.employerProjectsService.storeSocial(id, payload);
	}
}
