import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
	ActivatedCodeType,
	IActiveCodePayload,
	IStoreCodePayload,
	IUserActivatedCodeRepository,
	IUserActivedetCodeService,
	IUserUsedCodesRepository,
	USERS_ACTIVATED_CODE_REPOSITORY,
	USERS_USED_CODES_REPOSITORY,
} from '../typing';

@Injectable()
export class UserActivedetCodeService implements IUserActivedetCodeService {
	@Inject(USERS_ACTIVATED_CODE_REPOSITORY)
	private readonly userActivatedCodeRepository: IUserActivatedCodeRepository;

	@Inject(USERS_USED_CODES_REPOSITORY)
	private readonly userUsedCodeRepository: IUserUsedCodesRepository;

	async onModuleInit() {
		try {
			await this.create({ code: '1234', type: ActivatedCodeType.Institute });
		} catch (error) {}
	}

	public async create(payload: IStoreCodePayload) {
		if (payload.code.length < 4)
			throw new BadRequestException('minimum code length is 4 characters');

		const existCode = await this.userActivatedCodeRepository.findOne({
			where: { code: payload.code, type: payload.type },
		});

		if (existCode) throw new BadRequestException('this code already exists');

		await this.userActivatedCodeRepository.save({ code: payload.code, type: payload.type });

		return;
	}

	public async activeCode(userId: number, payload: IActiveCodePayload) {
		const existCode = await this.userActivatedCodeRepository.findOne({
			where: { code: payload.code, type: payload.type },
		});

		if (!existCode) return false;

		const hasActive = await this.userUsedCodeRepository.findOne({
			where: { userId, codeId: existCode.id },
		});

		if (hasActive) return true;

		await this.userUsedCodeRepository.save({ userId, codeId: existCode.id });

		return true;
	}
}
