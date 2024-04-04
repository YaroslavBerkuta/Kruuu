import { Inject, Injectable } from '@nestjs/common';
import { DUITKU_SERVICE, IDuitkuService } from '~api/domain/duitku/typing';
import { CreateTransactionPayloadDto, GetPaymentMethodsParamsDto } from './dto';
import { IUsersService, USERS_SERVICE, UserRole } from '~api/domain/users/typing';
import { NotFoundException } from '~api/shared';
import { ITalentsService, TALENTS_INFO_SERVICE } from '~api/domain/talents/typing';
import { EMPLOYERS_INFO_SERVICE, IEmployersService } from '~api/domain/employer/typing';

@Injectable()
export class AppDuitkuService {
	@Inject(DUITKU_SERVICE) private readonly duitkuService: IDuitkuService;
	@Inject(USERS_SERVICE) private readonly usersService: IUsersService;
	@Inject(TALENTS_INFO_SERVICE) private readonly talentsService: ITalentsService;
	@Inject(EMPLOYERS_INFO_SERVICE) private readonly employersService: IEmployersService;

	public async topUp(userId: number, dto: CreateTransactionPayloadDto) {
		const user = await this.usersService.getOneBy({ id: userId });
		if (!user) throw new NotFoundException('User not found');

		let userInfo;

		if (user.role === UserRole.Employer)
			userInfo = await this.employersService.getOneBy({ userId: user.id });
		else userInfo = await this.talentsService.getOneBy({ userId: user.id });

		return await this.duitkuService.createTransaction({
			...dto,
			userId,
			userEmail: user.email,
			userName: userInfo ? userInfo.name : '',
			productDetails: 'Payment for top up',
		});
	}

	public async getPaymentMethods(dto: GetPaymentMethodsParamsDto) {
		return await this.duitkuService.getPaymentMethods(dto);
	}
}
