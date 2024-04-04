import { Inject, Injectable } from '@nestjs/common';
import {
	IInstitutionService,
	INSTITUTION_REPOSITORY,
	ISaveInfo,
	IUpdateInfo,
	TInstitutionRepository,
} from '../typing';
import { IUsersService, USERS_SERVICE } from '~api/domain/users/typing';
import { compact } from 'lodash';

@Injectable()
export class InstitutionService implements IInstitutionService {
	@Inject(INSTITUTION_REPOSITORY) private readonly institutionRepository: TInstitutionRepository;
	@Inject(USERS_SERVICE) private readonly userService: IUsersService;

	private async updateProgressFillProfile(userId: number) {
		const columnCount = await this.institutionRepository.metadata.columns.length;
		const employer = await this.institutionRepository.findOneBy({ userId });

		await this.userService.changeFillProgress(
			userId,
			columnCount,
			compact(Object.values(employer)).length,
		);
	}

	public async saveInfo(userId: number, payload: ISaveInfo) {
		const existInstitute = await this.institutionRepository.findOneBy({ userId });
		if (existInstitute) await this.updateInfo(userId, payload);
		else await this.institutionRepository.save({ userId, ...payload });
		await this.updateProgressFillProfile(userId);
		return this.institutionRepository.findOneBy({ userId });
	}

	public async updateInfo(userId: number, payload: IUpdateInfo) {
		const existInstitute = await this.institutionRepository.findOneBy({ userId });
		if (!existInstitute) await this.institutionRepository.save({ userId, ...payload });
		else await this.institutionRepository.update(userId, payload);
		await this.updateProgressFillProfile(userId);
		return this.institutionRepository.findOneBy({ userId });
	}
}
