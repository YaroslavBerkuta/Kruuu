import { Controller, Get, Inject, Query } from '@nestjs/common'
import { DUITKU_SERVICE, IDuitkuService } from './typing'
import { ApiTags } from '@nestjs/swagger'

@Controller('duitku')
export class DuitkuController {
	@Inject(DUITKU_SERVICE) private readonly duitkuService: IDuitkuService

	@ApiTags('Duitku | Callback')
	@Get('callback')
	public callback(@Query() dto: any) {
		return this.duitkuService.checkTransaction(dto.merchantOrderId)
	}
}
