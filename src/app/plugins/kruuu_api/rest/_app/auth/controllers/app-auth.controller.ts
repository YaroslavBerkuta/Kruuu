import { Body, Controller, Post } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { TokenPairDto } from '~api/domain/sessions/typing';
import {
	AppleSignInPayloadDto,
	GoogleSignInPayloadDto,
	LoginPayloadDto,
	LogoutPayloadDto,
	RefreshTokenDto,
} from '../dto';
import { AppAuthService } from '../services';

@ApiTags('App | Auth')
@Controller('app/auth')
export class AppAuthController {
	constructor(private readonly appAuthService: AppAuthService) {}

	@ApiOperation({ summary: 'User login' })
	@ApiBody({ type: LoginPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Start session, returns access and refresh tokens',
		type: TokenPairDto,
	})
	@ApiBadRequestResponse({
		description: 'Invalid credentials',
	})
	@Post()
	public async login(@Body() dto: LoginPayloadDto) {
		return await this.appAuthService.signIn(dto);
	}

	@ApiOperation({ summary: 'User logout' })
	@ApiBody({ type: LogoutPayloadDto })
	@AuthGuard()
	@ApiResponse({
		status: 201,
		description: 'Close user session',
	})
	@ApiUnauthorizedResponse({
		description: 'Unauthorized',
	})
	@Post('logout')
	public async logout(@Body() dto: LogoutPayloadDto) {
		await this.appAuthService.logout(dto);
	}

	@ApiOperation({ summary: 'Refresh user session' })
	@ApiResponse({
		status: 201,
		description: 'Refresh session, returns new access and refresh tokens',
		type: TokenPairDto,
	})
	@ApiBadRequestResponse({
		description: 'Invalid credentials',
	})
	@Post('refresh-token')
	public async refreshToken(@Body() dto: RefreshTokenDto) {
		return await this.appAuthService.refreshToken(dto);
	}

	@ApiOperation({ summary: 'Auth by google' })
	@ApiResponse({
		status: 201,
		description: 'Auth by google',
		type: TokenPairDto,
	})
	@ApiBadRequestResponse({
		description: 'Invalid credentials',
	})
	@Post('sign-in-google')
	public async authByGoogle(@Body() dto: GoogleSignInPayloadDto) {
		return await this.appAuthService.signInByGoogle(dto);
	}

	@ApiOperation({ summary: 'Auth by apple' })
	@ApiResponse({
		status: 201,
		description: 'Auth by apple',
		type: TokenPairDto,
	})
	@ApiBadRequestResponse({
		description: 'Invalid credentials',
	})
	@Post('sign-in-apple')
	public async authByApple(@Body() dto: AppleSignInPayloadDto) {
		return await this.appAuthService.signInByApple(dto);
	}
}
