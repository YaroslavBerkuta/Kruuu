import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	CONFIRMATION_CODES_SERVICE,
	IConfirmationCodesService,
} from '~api/domain/confirmation/typing';
import { IMailerService, MAILER_SERVICE } from '~api/domain/mailer/typing';
import { ISessionsService, SESSIONS_SERVICE, SessionType } from '~api/domain/sessions/typing';
import { IUsersService, USERS_SERVICE } from '~api/domain/users/typing';
import { InvalidCredentialsException, WrongOTPException } from '~api/shared';
import {
	ConfirmOTPPayloadDto,
	RequestRecoveryOTPPayloadDto,
	ResetPasswordPayloadDto,
} from '../dto';

@Injectable()
export class AppPasswordRecoveryService {
	@Inject(USERS_SERVICE) private readonly usersService: IUsersService;
	@Inject(SESSIONS_SERVICE) private readonly sessionsService: ISessionsService;
	@Inject(CONFIRMATION_CODES_SERVICE)
	private readonly confirmationCodesService: IConfirmationCodesService;
	@Inject(MAILER_SERVICE) private readonly mailerService: IMailerService;

	public async requestOTP(dto: RequestRecoveryOTPPayloadDto) {
		const userExists = await this.usersService.getOneByEmail(dto.email);
		if (!userExists) throw new NotFoundException('User with this email not found');

		await this.confirmationCodesService.sendConfirmationCode(
			dto.email,
			async (code: string) =>
				await this.mailerService.send({
					subject: 'One time password',
					to: dto.email,
					text: `Your recovery one time password for Kruuu is ${code}`,
				}),
		);
	}

	public async compareOTP(dto: ConfirmOTPPayloadDto) {
		return this.confirmationCodesService.compareCode(dto.email, dto.code);
	}

	public async confirmRecovery(dto: ResetPasswordPayloadDto) {
		const user = await this.usersService.getOneByEmail(dto.email);
		if (!user) throw new InvalidCredentialsException();

		const isCorrectCode = await this.confirmationCodesService.confirmCode(dto.email, dto.code);
		if (!isCorrectCode) throw new WrongOTPException();

		await this.usersService.changeUserPassword(user.id, dto.password);

		const session = await this.sessionsService.start({
			userId: user.id,
			role: user.role,
			deviceName: dto.deviceName,
			type: SessionType.App,
		});

		return { accessToken: session.accessToken, refreshToken: session.refreshToken };
	}
}
