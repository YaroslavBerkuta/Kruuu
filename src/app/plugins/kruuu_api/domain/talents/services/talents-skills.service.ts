import { Inject, Injectable } from '@nestjs/common';
import {
	ITalentsSkillsRepository,
	ITalentsSkillsService,
	TALENTS_SKILLS_REPOSITORY,
} from '../typing';
import * as _ from 'lodash';

@Injectable()
export class TalentsSkillsService implements ITalentsSkillsService {
	@Inject(TALENTS_SKILLS_REPOSITORY)
	private readonly talentsSkillsRepository: ITalentsSkillsRepository;

	public async save(userId: number, skillTagIds: number[]) {
		await this.talentsSkillsRepository.delete({
			userId,
		});

		if (_.isEmpty(skillTagIds)) return null;

		return await this.talentsSkillsRepository.save(
			skillTagIds.map(it => {
				return {
					userId,
					skillTagId: it,
				};
			}),
		);
	}
}
