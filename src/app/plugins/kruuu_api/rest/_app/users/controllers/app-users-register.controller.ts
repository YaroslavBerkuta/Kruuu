import { Body, Controller, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import {
	ConfirmOTPPayloadDto,
	CreateUserPayloadDto,
	CreateUserResponseDto,
	RequestOTPPayloadDto,
} from '../dto';
import { AppUsersRegisterService } from '../services';

@ApiTags('App | Users | Register')
@Controller('app/users/register')
export class AppUsersRegisterController {
	constructor(private readonly appRegisterService: AppUsersRegisterService) {}

	@ApiOperation({ summary: 'User registration: step 1' })
	@ApiBody({ type: RequestOTPPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Send one time password to user email',
	})
	@ApiBadRequestResponse({
		description: 'User already exists',
	})
	@Post('request-otp')
	public async sendOTP(@Body() dto: RequestOTPPayloadDto) {
		return await this.appRegisterService.requestOTP(dto);
	}

	@ApiOperation({ summary: 'User registration: step 2' })
	@ApiBody({ type: ConfirmOTPPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Compare one time password',
		type: Boolean,
	})
	@Post('compare-otp')
	public async confirmOTP(@Body() dto: ConfirmOTPPayloadDto) {
		return await this.appRegisterService.compareOTP(dto);
	}

	@ApiOperation({ summary: 'User registration: step 3' })
	@ApiBody({ type: CreateUserPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Create user with base data, return user id and token pair',
		type: CreateUserResponseDto,
	})
	@ApiBadRequestResponse({
		description: 'Wrong one time password',
	})
	@Post()
	public async createUser(@Body() dto: CreateUserPayloadDto) {
		return await this.appRegisterService.createUser(dto);
	}
}
