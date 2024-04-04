import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InstitutionAccountService } from './institution-account.service';
import { ReqUser } from '~api/shared';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ActiveCodeDto, SaveInfoDto, UpdateInfoDto } from './dto';

@ApiTags('Institution | Account')
@Controller('institution/account')
export class InstitutionAccountController {
	constructor(private readonly accountService: InstitutionAccountService) {}

	@ApiOperation({ summary: 'Get institute info' })
	@ApiResponse({
		status: 201,
		description: 'return institute info object',
	})
	@AuthGuard()
	@Get()
	async getInstitute(@ReqUser() userId: number) {
		return await this.accountService.getDetail(userId);
	}

	@ApiOperation({ summary: 'Check exist actived code' })
	@ApiResponse({
		status: 201,
		description: 'return boolean value',
	})
	@AuthGuard()
	@Get('active-code')
	async activeCode(@ReqUser() userId: number, @Query() dto: ActiveCodeDto) {
		return await this.accountService.activeCode(userId, dto);
	}

	@ApiOperation({ summary: 'Institution base info' })
	@ApiBody({ type: SaveInfoDto })
	@ApiResponse({
		status: 201,
		description: 'Create and return Institution info',
	})
	@AuthGuard()
	@Post('info')
	async storeInfo(@ReqUser() userId: number, @Body() dto: SaveInfoDto) {
		return await this.accountService.saveInfo(userId, dto);
	}

	@ApiOperation({ summary: 'Update Institution info' })
	@ApiBody({ type: UpdateInfoDto })
	@ApiOkResponse({
		description: 'Update and return Institution info ',
	})
	@AuthGuard()
	@Patch('info')
	async uppdateInfo(@ReqUser() userId: number, @Body() dto: UpdateInfoDto) {
		return await this.accountService.uppdateInfo(userId, dto);
	}
}
