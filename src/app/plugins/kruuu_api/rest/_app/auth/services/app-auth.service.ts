import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InvalidCredentialsException } from '~api/shared';
import { GoogleSignInPayloadDto, LoginPayloadDto, LogoutPayloadDto, RefreshTokenDto } from '../dto';
import * as _ from 'lodash';
import { ISessionsService, SESSIONS_SERVICE, SessionType } from '~api/domain/sessions/typing';
import { IUsersService, USERS_SERVICE, UserSocialType } from '~api/domain/users/typing';
import { GoogleService } from '~api/libs';
import { AppleSignInPayloadDto } from '../dto/apple-sign-in.dto';
import { AppleService } from '~api/libs/apple/services';

@Injectable()
export class AppAuthService {
	@Inject(USERS_SERVICE) private readonly usersService: IUsersService;
	@Inject(SESSIONS_SERVICE) private readonly sessionsService: ISessionsService;

	constructor(private googleService: GoogleService, private appleService: AppleService) {}

	public async signIn(dto: LoginPayloadDto) {
		const user = await this.usersService.getOneByEmail(dto.email);
		if (!user) throw new InvalidCredentialsException();

		const isCorrect = await this.usersService.compareUserPassword(user.id, dto.password);
		if (!isCorrect) throw new InvalidCredentialsException();

		const session = await this.sessionsService.start({
			userId: user.id,
			role: user.role,
			deviceName: dto.deviceName,
			type: SessionType.App,
		});

		return { accessToken: session.accessToken, refreshToken: session.refreshToken };
	}

	public async logout(dto: LogoutPayloadDto) {
		await this.sessionsService.finishByToken(dto.refreshToken);
	}

	public async refreshToken(dto: RefreshTokenDto) {
		const sessions = await this.sessionsService.getSessionsByTokens([dto.refreshToken]);

		if (_.isEmpty(sessions)) throw new InvalidCredentialsException();

		const user = await this.usersService.getOneBy({ id: sessions[0].userId });
		if (!user) throw new InvalidCredentialsException();

		return await this.sessionsService.refresh(dto.refreshToken);
	}

	public async signInByGoogle(dto: GoogleSignInPayloadDto) {
		const googleUserInfo = await this.googleService.getGoogleUserIdByToken(dto.idToken);

		const user = await this.usersService.getSocialUser(
			googleUserInfo.id,
			UserSocialType.Google,
			dto.role
				? {
						email: googleUserInfo.email,
						name: `${googleUserInfo.firstName} ${googleUserInfo.lastName}`,
						role: dto.role,
				  }
				: null,
		);

		if (!user) throw new BadRequestException();

		const session = await this.sessionsService.start({
			userId: user.id,
			role: user.role,
			deviceName: dto.deviceName,
			type: SessionType.App,
		});

		return { accessToken: session.accessToken, refreshToken: session.refreshToken };
	}

	public async signInByApple(dto: AppleSignInPayloadDto) {
		const data = await this.appleService.getAppleUserIdByToken(dto.idToken);
		const user = await this.usersService.getSocialUser(
			data,
			UserSocialType.Apple,
			dto.role
				? {
						email: dto.email,
						name: `${dto.firstName} ${dto.lastName}`,
						role: dto.role,
				  }
				: null,
		);
		if (!user) throw new NotFoundException('User not exist');

		const session = await this.sessionsService.start({
			userId: user.id,
			role: user.role,
			deviceName: dto.deviceName,
			type: SessionType.App,
		});

		return { accessToken: session.accessToken, refreshToken: session.refreshToken };
	}
}
