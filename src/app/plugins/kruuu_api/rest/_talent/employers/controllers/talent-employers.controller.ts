import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployerAccountDto } from '~api/domain/employer/typing';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ApiImplictPagination, IPagination, ReqPagination } from '~api/shared';
import { GetEmployersListResponseDto } from '../dto';
import { TalentEmployersService } from '../services';

@ApiTags('Talent | Employers')
@Controller('talent/employers')
export class TalentEmployersController {
	constructor(private readonly employersService: TalentEmployersService) {}

	@ApiOperation({ summary: 'Get employers list' })
	@ApiOkResponse({
		description: 'Return employers list with count',
		type: GetEmployersListResponseDto,
	})
	@ApiImplictPagination()
	@AuthGuard()
	@Get()
	public async getEmployersList(@ReqPagination() pagination: IPagination) {
		return await this.employersService.getList(pagination);
	}

	@ApiOperation({ summary: "Get employer's details" })
	@ApiOkResponse({
		description: 'Return employer with full info',
		type: EmployerAccountDto,
	})
	@AuthGuard()
	@Get(':id')
	public async getTalent(@Param('id') id: number) {
		return await this.employersService.getDetails(id);
	}
}
