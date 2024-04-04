import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppWalletsService } from './wallets.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { IncreaseBalanceDto, IncreaseCreaditDto } from './dto';

@ApiTags('App | Wallets')
@Controller('app/wallets')
export class AppWalletsController {
	constructor(private readonly appWalletsService: AppWalletsService) {}

	@Post()
	@AuthGuard()
	public createDefaultWallets(@ReqUser() userId: number) {
		return this.appWalletsService.createDefaultWallets(userId);
	}

	@ApiOperation({ summary: 'Get wallets' })
	@ApiResponse({
		status: 201,
		description: 'return array user wallets',
	})
	@Get('list')
	@AuthGuard()
	public walletsList(@ReqUser() userId: number) {
		return this.appWalletsService.walletsList(userId);
	}

	@ApiOperation({ summary: 'Get user transaction' })
	@ApiResponse({
		status: 201,
		description: 'return user transactions list',
	})
	@ApiImplictPagination()
	@Get('transactions')
	@AuthGuard()
	public transactionList(@ReqUser() userId: number, @ReqPagination() pagination: IPagination) {
		return this.appWalletsService.transactionList(userId, pagination);
	}

	@ApiOperation({ summary: 'Increase balance' })
	@ApiResponse({
		status: 201,
		description: 'Increase balance user wallet balance',
	})
	@Post('increase-balance')
	@AuthGuard()
	public increaseBalance(@ReqUser() userId: number, @Body() dto: IncreaseBalanceDto) {
		return this.appWalletsService.increaseBalance(userId, dto);
	}

	@Post('buy-creadit')
	@AuthGuard()
	public buyCredit(@ReqUser() userId: number, @Body() dto: IncreaseCreaditDto) {
		return this.appWalletsService.buyCredit(userId, dto);
	}
}
