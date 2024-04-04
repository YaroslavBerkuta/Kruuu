import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
	ApplicationStatus,
	APPLICATIONS_REPOSITORY,
	IApplicationRepository,
	APPLICATIONS_SERVICE,
	IApplicationService,
} from '~api/domain/applications/typing';
import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository } from '~api/domain/galleries/interface';
import { ITagsRepository, TAGS_REPOSITORY } from '~api/domain/tags/typing';
import { IPagination, WalletReason, paginateAndGetMany } from '~api/shared';
import { transformFileUrl } from '~api/shared/transforms';
import { Brackets } from 'typeorm';
import { GetApplicationListDto } from './dto';
import { ITalentLikeRepository, TALENT_LIKE_REPOSITORY } from '~api/domain/talents/typing';
import { isEmpty } from 'lodash';
import { CheckoutType, IStripeService, STRIPE_SERVICE } from '~api/domain/stripe/typing';
import {
	Currency,
	IWalletService,
	IWalletsRepository,
	WALLETS_REPOSITORY,
	WALLETS_SERVICE,
} from '~api/domain/wallets/typing';

@Injectable()
export class EmployerApplicationsService {
	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;
	@Inject(TAGS_REPOSITORY) private readonly tagRepository: ITagsRepository;
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;
	@Inject(TALENT_LIKE_REPOSITORY) private readonly talentLikeRepository: ITalentLikeRepository;
	@Inject(STRIPE_SERVICE) private readonly stripeService: IStripeService;
	@Inject(WALLETS_SERVICE) private readonly walletService: IWalletService;
	@Inject(WALLETS_REPOSITORY) private readonly walletRepository: IWalletsRepository;
	@Inject(APPLICATIONS_SERVICE) private readonly applicationService: IApplicationService;

	public async getList(userId: number, pagination: IPagination, dto: GetApplicationListDto) {
		const query = await this.applicationRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.job', 'job')
			.leftJoinAndSelect('it.talent', 'talent')
			.leftJoinAndSelect('job.project', 'project')
			.where('it.employerId = :userId', { userId });

		if (dto.status) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('it.status = :status', { status: dto.status });
				}),
			);
		}

		if (dto.projectId) {
			query.andWhere(
				new Brackets(qb => {
					qb.where('project.id = :projectId', { projectId: dto.projectId });
				}),
			);
		}

		const { items, count } = await paginateAndGetMany(query, pagination, 'it');

		await Promise.all(
			items.map(async (it, i, arr: any) => {
				let avatar = await this.galleryRepository.findOne({
					where: { parentId: String(it.talentId), parentTable: 'talents' },
				});
				arr[i].talent.mainOccupTagId = (
					await this.tagRepository.findOne({
						where: { id: it?.talent?.mainOccupTagId },
					})
				)?.name;

				arr[i].job.project.industryId = (
					await this.tagRepository.findOne({
						where: { id: it.job.project.industryId },
					})
				)?.name;

				arr[i].job.job = (await this.tagRepository.findOne({ where: { id: it.job.job } }))?.name;

				arr[i].talent.secondOccupTagId = (
					await this.tagRepository.findOne({
						where: { id: it.talent.secondOccupTagId },
					})
				)?.name;

				arr[i].talent.avatarUrl = avatar && transformFileUrl(avatar.fileUrl);

				arr[i].talent.liked = !isEmpty(
					await this.talentLikeRepository.find({
						where: { employerId: userId, talentId: it.talent.userId },
					}),
				);
			}),
		);

		return { items, count };
	}

	public async updateStatus(id: number, status: ApplicationStatus) {
		if (status === ApplicationStatus.Accepted) throw new BadRequestException();
		if (status === ApplicationStatus.Applicants) throw new BadRequestException();

		const application = await this.applicationRepository.findOneBy({ id });
		if (application.status === status) throw new BadRequestException('Application rejected');
		return await this.applicationService.updateStatus({ applicationId: id, status });
	}

	public async acceptApplication(userId: number, id: number) {
		const wallet = await this.walletRepository.findOne({
			where: { userId, currency: Currency.Credit },
		});

		console.log('wallet', wallet);
		if (Number(wallet.balance) >= 1) {
			const application = await this.applicationRepository.findOneBy({ id });

			await this.walletService.decreaseBalance({
				walletId: wallet.id,
				reason: WalletReason.AcceptApplication,
				value: 1,
			});

			await this.applicationService.updateStatus({
				status: ApplicationStatus.Accepted,
				applicationId: application.id,
			});
			return null;
		} else {
			return await this.stripeService.createCheckout(userId, {
				checkoutType: CheckoutType.acceptApplication,
				objectId: id,
			});
		}
	}
}
