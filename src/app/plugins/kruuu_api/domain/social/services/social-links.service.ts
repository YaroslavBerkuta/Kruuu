import { Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { SOCIAL_LINKS_REPOSITORY } from '../typing/consts';
import {
	IGetSocialLinksParams,
	IPutSocialLinksPayload,
	ISocialLinksService,
	SocialLinksRepository,
} from '../typing/interfaces';

@Injectable()
export class SocialLinksService implements ISocialLinksService {
	@Inject(SOCIAL_LINKS_REPOSITORY)
	private readonly socialLinksRepository: SocialLinksRepository;

	public async put(payload: IPutSocialLinksPayload) {
		await this.socialLinksRepository.delete({
			parentId: payload.parentId,
			parentType: payload.parentType,
		});

		if (_.isEmpty(payload.items)) return null;

		return await this.socialLinksRepository.save(
			payload.items.map(it => {
				return {
					parentId: payload.parentId,
					parentType: payload.parentType,
					key: it.key,
					value: it.value,
				};
			}),
		);
	}

	public async get(params: IGetSocialLinksParams) {
		return this.socialLinksRepository.findBy({
			parentId: params.parentId,
			parentType: params.parentType,
		});
	}

	public async delete(params: IGetSocialLinksParams): Promise<void> {
		await this.socialLinksRepository.delete({
			parentId: params.parentId,
			parentType: params.parentType,
		});
	}
}
