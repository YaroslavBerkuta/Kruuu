import { Inject, Injectable } from '@nestjs/common';
import {
	CONFIRMATION_CODES_SERVICE,
	IConfirmationCodesService,
} from '~api/domain/confirmation/typing';
import { IMailerService, MAILER_SERVICE } from '~api/domain/mailer/typing';
import { ISessionsService, SESSIONS_SERVICE, SessionType } from '~api/domain/sessions/typing';
import { IUsersService, USERS_SERVICE } from '~api/domain/users/typing';
import { UserAlreadyExistsException, WrongOTPException } from '~api/shared';
import { ConfirmOTPPayloadDto, CreateUserPayloadDto, RequestOTPPayloadDto } from '../dto';

@Injectable()
export class AppUsersRegisterService {
	@Inject(USERS_SERVICE) private readonly usersService: IUsersService;
	@Inject(CONFIRMATION_CODES_SERVICE)
	private readonly confirmationCodesService: IConfirmationCodesService;
	@Inject(MAILER_SERVICE) private readonly mailerService: IMailerService;
	@Inject(SESSIONS_SERVICE) private readonly sessionsService: ISessionsService;

	public async requestOTP(dto: RequestOTPPayloadDto) {
		const userExists = await this.usersService.getOneByEmail(dto.email);
		if (userExists) throw new UserAlreadyExistsException();

		await this.confirmationCodesService.sendConfirmationCode(dto.email, async (code: string) => {
			console.log('code', code);
			await this.mailerService.send({
				subject: 'One time password',
				to: dto.email,
				text: `Your one time password to get started with Kruuu is ${code}`,
			});
		});
	}

	public async compareOTP(dto: ConfirmOTPPayloadDto) {
		return this.confirmationCodesService.compareCode(dto.email, dto.code);
	}

	public async createUser(dto: CreateUserPayloadDto) {
		const isCorrectCode = await this.confirmationCodesService.confirmCode(dto.email, dto.code);
		if (!isCorrectCode) throw new WrongOTPException();

		const userId = await this.usersService.create(dto);

		const session = await this.sessionsService.start({
			userId,
			role: dto.role,
			deviceName: dto.deviceName,
			type: SessionType.App,
		});

		return { userId, accessToken: session.accessToken, refreshToken: session.refreshToken };
	}
}
