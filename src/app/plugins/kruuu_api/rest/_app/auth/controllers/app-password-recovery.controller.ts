import { Body, Controller, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiNotFoundResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import {
	ConfirmOTPPayloadDto,
	RequestRecoveryOTPPayloadDto,
	ResetPasswordPayloadDto,
	ResetPasswordResponseDto,
} from '../dto';
import { AppPasswordRecoveryService } from '../services';

@ApiTags('App | Auth | Password recovery')
@Controller('app/auth/password-recovery')
export class AppPasswordRecoveryController {
	constructor(private readonly appRecoveryService: AppPasswordRecoveryService) {}

	@ApiOperation({ summary: 'Password recovery: step 1' })
	@ApiBody({ type: RequestRecoveryOTPPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Send one time password to user email',
	})
	@ApiNotFoundResponse({
		description: 'User with this email not found',
	})
	@Post('request-otp')
	public async sendOTP(@Body() dto: RequestRecoveryOTPPayloadDto) {
		return await this.appRecoveryService.requestOTP(dto);
	}

	@ApiOperation({ summary: 'Password recovery: step 2' })
	@ApiBody({ type: ConfirmOTPPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Compare one time password',
		type: Boolean,
	})
	@Post('compare-otp')
	public async confirmOTP(@Body() dto: ConfirmOTPPayloadDto) {
		return await this.appRecoveryService.compareOTP(dto);
	}

	@ApiOperation({ summary: 'Password recovery: step 3' })
	@ApiBody({ type: ResetPasswordPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Change user password, return token pair',
		type: ResetPasswordResponseDto,
	})
	@ApiBadRequestResponse({
		description: 'Wrong one time password | Invalid credentials',
	})
	@Post()
	public async confirmRecovery(@Body() dto: ResetPasswordPayloadDto) {
		return await this.appRecoveryService.confirmRecovery(dto);
	}
}
