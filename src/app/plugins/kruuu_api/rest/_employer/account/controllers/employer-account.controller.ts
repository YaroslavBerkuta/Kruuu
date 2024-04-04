import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EmployerAccountDto, EmployerDto } from '~api/domain/employer/typing';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ReqUser } from '~api/shared';
import {
	SaveEmployerInfoPayloadDto,
	SaveEmployerSocialMediaPayloadDto,
	UpdateEmployerInfoPayloadDto,
} from '../dto';
import { EmployerAccountService } from '../services';

@ApiTags('Employer | Account')
@Controller('employer/account')
export class EmployerAccountController {
	constructor(private readonly accountService: EmployerAccountService) {}

	@ApiOperation({ summary: 'Employer base info' })
	@ApiBody({ type: SaveEmployerInfoPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Create and return employer info with base info',
		type: EmployerDto,
	})
	@AuthGuard()
	@Post('info')
	public async saveInfo(@ReqUser() userId: number, @Body() dto: SaveEmployerInfoPayloadDto) {
		return await this.accountService.saveBaseInfo(userId, dto);
	}

	@ApiOperation({ summary: 'Update employer info' })
	@ApiBody({ type: UpdateEmployerInfoPayloadDto })
	@ApiOkResponse({
		description: 'Update and return employer info (create if not exist)',
		type: EmployerDto,
	})
	@AuthGuard()
	@Patch('info')
	public async updateInfo(@ReqUser() userId: number, @Body() dto: UpdateEmployerInfoPayloadDto) {
		return await this.accountService.updateEmployerInfo(userId, dto);
	}

	@ApiOperation({ summary: 'Save/update employer social media' })
	@ApiBody({ type: SaveEmployerSocialMediaPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Save/update employer social media',
	})
	@AuthGuard()
	@Post('social-media')
	public async saveSocialMedia(
		@ReqUser() userId: number,
		@Body() dto: SaveEmployerSocialMediaPayloadDto,
	) {
		return await this.accountService.saveSocialMedia(userId, dto);
	}

	@ApiOperation({ summary: 'Get employer details' })
	@ApiOkResponse({
		description: 'Return employer details if they exist',
		type: EmployerAccountDto,
	})
	@AuthGuard()
	@Get()
	public async getTalent(@ReqUser() userId: number) {
		return await this.accountService.getDetails(userId);
	}
}
