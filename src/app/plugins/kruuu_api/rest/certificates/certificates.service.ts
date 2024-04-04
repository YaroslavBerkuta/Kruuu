import { Inject, Injectable } from '@nestjs/common';
import {
	CERTEFICATE_TO_USER_REPOSITORY,
	ICerteficatesToUserRepository,
} from '~api/domain/certificates/typing';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';

import { INSTITUTION_REPOSITORY, TInstitutionRepository } from '~api/domain/institutoins/typing';

@Injectable()
export class RestCertificatesService {
	@Inject(CERTEFICATE_TO_USER_REPOSITORY)
	private readonly certeficateToUserRepository: ICerteficatesToUserRepository;

	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;

	@Inject(INSTITUTION_REPOSITORY)
	private readonly institutionRepository: TInstitutionRepository;

	public async getUserCertificates(targetUserId: number) {
		const items: any[] = await this.certeficateToUserRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.certeficate', 'certeficate')
			.where('it.userId = :userId', { userId: targetUserId })
			.getMany();

		for await (const [index, item] of items.entries()) {
			try {
				const instituteInfo = await this.institutionRepository.findOneBy({
					userId: item.certeficate.userId,
				});

				items[index] = {
					...item.certeficate,
					institute: instituteInfo,
					files: await this.galleryService.get({
						parentId: item.certeficate?.id,
						parentTable: 'certifications',
					}),
				};
			} catch (e) {
				items[index] = null;
			}
		}

		return items;
	}
}
