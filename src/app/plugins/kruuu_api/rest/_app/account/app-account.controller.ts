import { Body, Controller, Delete, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ReqUser } from '~api/shared';
import { AppAccountService } from './app-account.service';
import { RemoveUserPayloadDto } from './dto';

@ApiTags('App | Account')
@Controller('app/account')
export class AppAccountController {
	constructor(private readonly appAccountService: AppAccountService) {}

	@ApiOperation({ summary: 'Get user account' })
	@ApiResponse({
		status: 201,
		description: 'return user data',
	})
	@AuthGuard()
	@Get()
	public getAccount(@ReqUser() id: number) {
		return this.appAccountService.getAccount(id);
	}

	@ApiOperation({ summary: 'Remove user' })
	@ApiResponse({ status: 201, description: '' })
	@AuthGuard()
	@Delete()
	public remove(@ReqUser() id: number, @Body() dto: RemoveUserPayloadDto) {
		return this.appAccountService.delete(id, dto);
	}
}
