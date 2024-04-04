import { Inject, Injectable } from '@nestjs/common';
import {
	IInstitutionService,
	INSTITUTION_REPOSITORY,
	INSTITUTION_SERVICES,
	TInstitutionRepository,
} from '~api/domain/institutoins/typing';
import { IUserActivedetCodeService, USERS_ACTIVATED_CODE_SERVICE } from '~api/domain/users/typing';
import { ActiveCodeDto, SaveInfoDto, UpdateInfoDto } from './dto';

@Injectable()
export class InstitutionAccountService {
	@Inject(INSTITUTION_SERVICES) private readonly institutionService: IInstitutionService;
	@Inject(INSTITUTION_REPOSITORY) private readonly instituteRepository: TInstitutionRepository;
	@Inject(USERS_ACTIVATED_CODE_SERVICE)
	private readonly activeCodeService: IUserActivedetCodeService;

	async saveInfo(userId: number, dto: SaveInfoDto) {
		try {
			const info = await this.institutionService.saveInfo(userId, dto);
			return info;
		} catch (error) {
			console.log(error);
			throw new Error('something went wrong');
		}
	}

	async activeCode(userId: number, dto: ActiveCodeDto) {
		return await this.activeCodeService.activeCode(userId, dto);
	}

	async uppdateInfo(userId: number, dto: UpdateInfoDto) {
		return await this.institutionService.updateInfo(userId, dto);
	}

	async getDetail(userId: number) {
		const intitute = await this.instituteRepository.findOne({ where: { userId } });

		if (!intitute) return null;

		return intitute;
	}
}
