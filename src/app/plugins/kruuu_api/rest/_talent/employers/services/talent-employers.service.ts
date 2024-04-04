import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
	ApplicationStatus,
	APPLICATIONS_REPOSITORY,
	IApplicationRepository,
} from '~api/domain/applications/typing';
import {
	EMPLOYERS_INFO_REPOSITORY,
	IEmployerInfo,
	IEmployersInfoRepository,
} from '~api/domain/employer/typing';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import {
	ISocialLinksService,
	SocialLinkDto,
	SOCIAL_LINKS_SERVICE,
} from '~api/domain/social/typing';
import { IPagination, paginateAndGetMany, prepareSearchString } from '~api/shared';

@Injectable()
export class TalentEmployersService {
	@Inject(EMPLOYERS_INFO_REPOSITORY)
	private readonly employersInfoRepository: IEmployersInfoRepository;
	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;
	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;

	public async getList(pagination: IPagination) {
		const query = this.employersInfoRepository.createQueryBuilder('it');

		if (pagination.searchString)
			query.andWhere('it.name ILIKE :name', {
				name: prepareSearchString(pagination.searchString),
			});

		return paginateAndGetMany(query, pagination, 'it');
	}

	public async getDetails(userId: number) {
		const employer = await this.employersInfoRepository.findOneBy({ userId });
		if (!employer) return null;

		return this.prepareDetails(employer);
	}

	private async prepareDetails(employer: IEmployerInfo) {
		const socialMedia = await this.socialLinksService.get({
			parentType: 'employer',
			parentId: employer.userId,
		});
		employer.socialMedia = plainToInstance(SocialLinkDto, socialMedia);

		employer.gallery = await this.galleryService.get({
			parentId: employer.userId,
			parentTable: 'employers',
		});

		const applications = await this.applicationRepository.find({
			where: { employerId: employer.userId, status: ApplicationStatus.Accepted },
		});

		employer.applications = applications;

		return employer;
	}
}
