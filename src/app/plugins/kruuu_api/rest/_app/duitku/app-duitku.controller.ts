import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppDuitkuService } from './app-duitku.service';
import { CreateTransactionPayloadDto, GetPaymentMethodsParamsDto } from './dto';
import { PaymentMethodDto, TransactionDto } from '~api/domain/duitku/typing';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ReqUser } from '~api/shared';

@ApiTags('App | Duitku payments')
@Controller('app/duitku')
export class AppDuitkuController {
	constructor(private readonly appDuitkuService: AppDuitkuService) {}

	/*************************************************************************************** */

	@ApiOperation({ summary: 'Create top up transaction' })
	@ApiBody({ type: CreateTransactionPayloadDto })
	@ApiResponse({
		status: 201,
		type: TransactionDto,
		description: 'Create top up transaction and return it',
	})
	@AuthGuard()
	@Post('top-up')
	public async createChat(@ReqUser() userId: number, @Body() dto: CreateTransactionPayloadDto) {
		return await this.appDuitkuService.topUp(userId, dto);
	}

	/*************************************************************************************** */

	@ApiOperation({
		summary: 'Get payment methods list',
	})
	@ApiOkResponse({
		description: 'Return available payment methods list',
		type: PaymentMethodDto,
		isArray: true,
	})
	@AuthGuard()
	@Get('payment-methods')
	public async getPaymentMethods(@Query() params: GetPaymentMethodsParamsDto) {
		return this.appDuitkuService.getPaymentMethods(params);
	}
}
