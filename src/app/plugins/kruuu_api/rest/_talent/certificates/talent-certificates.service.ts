import { Inject, Injectable } from '@nestjs/common';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import {
	CERTEFICATE_TO_USER_REPOSITORY,
	ICerteficatesToUserRepository,
} from '~api/domain/certificates/typing';

@Injectable()
export class TalentCertificatesService {
	@Inject(CERTEFICATE_TO_USER_REPOSITORY)
	private readonly certeficateToUserRepository: ICerteficatesToUserRepository;
	@Inject(GALLERY_SERVICE) private readonly galleryService: IGalleryService;

	public async myCertfificates(userId: number) {
		const query = await this.certeficateToUserRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.certeficate', 'certeficate')
			.where('it.userId = :userId', { userId })
			.getMany();

		const result = Promise.all(
			query.map(async it => ({
				...it.certeficate,
				files: await this.galleryService.get({
					parentId: it.certeficateId,
					parentTable: 'certifications',
				}),
			})),
		);

		return result;
	}
}
