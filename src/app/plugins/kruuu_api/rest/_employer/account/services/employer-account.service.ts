import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
	ApplicationStatus,
	APPLICATIONS_REPOSITORY,
	IApplicationRepository,
} from '~api/domain/applications/typing';
import {
	EMPLOYERS_INFO_SERVICE,
	IEmployerInfo,
	IEmployersService,
} from '~api/domain/employer/typing';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import {
	ISocialLinksService,
	SocialLinkDto,
	SOCIAL_LINKS_SERVICE,
} from '~api/domain/social/typing';
import {
	SaveEmployerInfoPayloadDto,
	SaveEmployerSocialMediaPayloadDto,
	UpdateEmployerInfoPayloadDto,
} from '../dto';

@Injectable()
export class EmployerAccountService {
	@Inject(EMPLOYERS_INFO_SERVICE) private readonly employersInfoService: IEmployersService;
	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;

	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;

	public async saveBaseInfo(userId: number, dto: SaveEmployerInfoPayloadDto) {
		return this.employersInfoService.saveInfo(userId, dto);
	}

	public async updateEmployerInfo(userId: number, dto: UpdateEmployerInfoPayloadDto) {
		return this.employersInfoService.updateInfo(userId, dto);
	}

	public async saveSocialMedia(userId: number, dto: SaveEmployerSocialMediaPayloadDto) {
		await this.employersInfoService.saveSocialMedia(userId, dto);
	}

	public async getDetails(userId: number) {
		const employer = await this.employersInfoService.getOneBy({ userId });
		if (!employer) return null;

		return this.prepareDetails(employer);
	}

	private async prepareDetails(employer: IEmployerInfo) {
		const applications = await this.applicationRepository.find({
			where: { employerId: employer.userId, status: ApplicationStatus.Accepted },
		});

		employer.applications = applications;

		const socialMedia = await this.socialLinksService.get({
			parentType: 'employer',
			parentId: employer.userId,
		});
		employer.socialMedia = plainToInstance(SocialLinkDto, socialMedia);

		employer.gallery = await this.galleryService.get({
			parentId: employer.userId,
			parentTable: 'employers',
		});

		return employer;
	}
}
