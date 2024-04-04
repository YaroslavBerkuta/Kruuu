import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import {
	ISaveEducations,
	ITalentEducationRepository,
	TALENTS_EDUCATION_REPOSITORY,
} from '../typing';

@Injectable()
export class TalentsEducationService {
	@Inject(TALENTS_EDUCATION_REPOSITORY)
	private readonly talentsEducationsRepository: ITalentEducationRepository;

	public async save(talentId: number, educations: ISaveEducations[]) {
		await this.talentsEducationsRepository.delete({
			talentId,
		});

		if (_.isEmpty(educations)) return null;

		return await this.talentsEducationsRepository.save(
			educations.map(it => {
				return {
					talentId,
					title: it.title,
					description: it.description,
				};
			}),
		);
	}
}
