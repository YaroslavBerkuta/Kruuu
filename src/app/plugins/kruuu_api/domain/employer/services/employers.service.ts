import { Inject, Injectable } from '@nestjs/common';
import { prepareSearchString } from '~api/shared';
import { FindOptionsWhere } from 'typeorm';
import {
	EMPLOYERS_INFO_REPOSITORY,
	IEmployerInfo,
	IEmployersInfoRepository,
	IEmployersService,
	ISaveEmployerInfoPayload,
	ISaveEmployerSocialMediaPayload,
	IUpdateEmployerInfoPayload,
} from '../typing';
import * as _ from 'lodash';

import { compact } from 'lodash';
import { ISocialLinksService, SOCIAL_LINKS_SERVICE } from '~api/domain/social/typing';
import { IUsersService, USERS_SERVICE } from '~api/domain/users/typing';

@Injectable()
export class EmployersService implements IEmployersService {
	@Inject(EMPLOYERS_INFO_REPOSITORY)
	private readonly employersInfoRepository: IEmployersInfoRepository;
	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;
	@Inject(USERS_SERVICE) private readonly userService: IUsersService;

	private async updateProgressFillProfile(userId: number) {
		const columnCount = await this.employersInfoRepository.metadata.columns.length;
		const employer = await this.employersInfoRepository.findOneBy({ userId });
		if (!employer) return;
		await this.userService.changeFillProgress(
			userId,
			columnCount,
			compact(Object.values(employer)).length,
		);
	}

	public async saveInfo(userId: number, payload: ISaveEmployerInfoPayload) {
		const existEmployer = await this.employersInfoRepository.findOneBy({ userId });
		if (existEmployer) return this.updateInfo(userId, payload);

		const employer = this.employersInfoRepository.save({ userId, ...payload });

		await this.updateProgressFillProfile(userId);

		return employer;
	}

	public async updateInfo(userId: number, payload: IUpdateEmployerInfoPayload) {
		const existEmployer = await this.employersInfoRepository.findOneBy({ userId });
		if (!existEmployer) return this.employersInfoRepository.save({ userId, ...payload });
		await this.employersInfoRepository.update(userId, payload);
		await this.updateProgressFillProfile(userId);

		return await this.employersInfoRepository.findOneBy({ userId });
	}

	public async saveSocialMedia(userId: number, payload: ISaveEmployerSocialMediaPayload) {
		await this.socialLinksService.put({
			parentId: userId,
			parentType: 'employer',
			items: payload.socialMedia,
		});
	}

	public async getOneBy(
		where: FindOptionsWhere<IEmployerInfo> | FindOptionsWhere<IEmployerInfo>[],
	) {
		return this.employersInfoRepository.findOneBy(where);
	}

	public async getBySearchString(searchStr: string, includeIds?: number[]) {
		if (!searchStr) return [];

		const query = this.employersInfoRepository
			.createQueryBuilder('it')
			.where('it.name ILIKE :name', {
				name: prepareSearchString(searchStr),
			});

		if (!_.isEmpty(includeIds)) query.andWhere('it.userId IN (:...includeIds)', { includeIds });

		return query.getMany();
	}
}
