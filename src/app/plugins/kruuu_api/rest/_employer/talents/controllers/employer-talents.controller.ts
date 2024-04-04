import { Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { TalentAccountDto, TalentPlainDto } from '~api/domain/talents/typing';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { GetTalentsListResponseDto, LocationsListRespDto } from '../dto';
import { EmployerTalentsService } from '../services';

@ApiTags('Employer | Talents')
@Controller('employer/talents')
export class EmployerTalentsController {
	constructor(private readonly talentsService: EmployerTalentsService) {}

	@ApiOperation({ summary: 'Get talents locations list' })
	@ApiOkResponse({
		description: 'Return talents locations list with count',
		type: LocationsListRespDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get('locations')
	public async getLocationsList(@ReqPagination() pagination: IPagination) {
		return await this.talentsService.getTalentsLocations(pagination);
	}

	@ApiOperation({ summary: 'Get talents list' })
	@ApiOkResponse({
		description: 'Return talents list with count',
		type: GetTalentsListResponseDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get()
	public async getTalentsList(@ReqPagination() pagination: IPagination) {
		return await this.talentsService.getList(pagination);
	}

	@ApiOperation({ summary: 'Get talent details' })
	@ApiOkResponse({
		description: 'Return talent with full info',
		type: TalentAccountDto,
	})
	@AuthGuard()
	@Get(':id')
	public async getTalent(@ReqUser() userId: number, @Param('id') id: number) {
		const talent = await this.talentsService.getDetails(userId, id);
		return plainToInstance(TalentPlainDto, talent);
	}

	@ApiOperation({ summary: 'Like the talent' })
	@AuthGuard()
	@Put('like/:id')
	public async likeTalent(@ReqUser() userId: number, @Param('id') talentId: number) {
		return this.talentsService.likeTalent(userId, talentId);
	}
}
