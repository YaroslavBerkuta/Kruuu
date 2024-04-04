import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATIONS_USERS_DEVICES_REPOSITORY } from '../typing/consts';
import { NotificationUserDevicesRepository } from '../typing/interfaces';
import { NotificationsService } from './notifications.service';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationType, NotificationsGroup } from '../typing/enums';
import { isEmpty } from 'lodash';
import { ApplicationAccept } from '~api/domain/applications/event';
import { APPLICATIONS_REPOSITORY, IApplicationRepository } from '~api/domain/applications/typing';
import { EMPLOYERS_INFO_REPOSITORY, IEmployersInfoRepository } from '~api/domain/employer/typing';
import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository } from '~api/domain/galleries/interface';
import { JOB_REPOSITORY } from '~api/domain/jobs/consts';
import { IJobRepository } from '~api/domain/jobs/typing';
import { TALENTS_INFO_REPOSITORY, ITalentsInfoRepository } from '~api/domain/talents/typing';
import { Events, IEventsPayloads } from '~api/shared';

@Injectable()
export class NotificationsEventsHandlerService {
	@Inject(NOTIFICATIONS_USERS_DEVICES_REPOSITORY)
	private deviceRepository: NotificationUserDevicesRepository;

	@Inject(TALENTS_INFO_REPOSITORY) private readonly talentRepository: ITalentsInfoRepository;

	@Inject(EMPLOYERS_INFO_REPOSITORY) private employerRepository: IEmployersInfoRepository;

	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;

	@Inject(JOB_REPOSITORY) private readonly jobRepository: IJobRepository;

	@Inject(APPLICATIONS_REPOSITORY) private readonly applicationRepository: IApplicationRepository;

	constructor(private notificationsService: NotificationsService) {}

	private async getImage(userId: number, parentTable: string): Promise<string> {
		const image = await this.galleryRepository.findOne({
			where: { parentId: String(userId), parentTable },
		});
		return image?.fileUrl;
	}

	@OnEvent(Events.OnUserDisconnect)
	public async onUserLogOut(payload: IEventsPayloads['OnUserDisconnect']) {
		await this.deviceRepository.delete({
			userId: payload.userId,
			deviceUuid: payload.deviceUUId,
		});
	}

	@OnEvent(Events.OnNewMessage)
	public async onNewMessage(payload: IEventsPayloads['OnNewMessage']) {
		const talent = await this.talentRepository.findOne({ where: { userId: payload.authorId } });
		const employer = await this.employerRepository.findOne({
			where: { userId: payload.authorId },
		});

		payload.targetUser.forEach(async it => {
			await this.notificationsService.addNotification({
				userId: it.userId,
				title: 'New message in chat',
				content: `${talent?.name || employer?.name} messaged you`,
				group: NotificationsGroup.Chats,
				isPushMuted: null,
				imageUrl: await this.getImage(payload.authorId, isEmpty(talent) ? 'employers' : 'talents'),
				data: {
					chatId: payload.chatId,
					type: NotificationType.NewMessage,
				},
			});
		});
	}

	@OnEvent(Events.NewApplication)
	public async onNewApplication(payload: IEventsPayloads['NewApplication']) {
		const talent = await this.talentRepository.findOne({ where: { userId: payload.talentId } });
		const employer = await this.employerRepository.findOne({
			where: { userId: payload.employerId },
		});

		const job = await this.jobRepository.findOne({ where: { id: payload.jobId } });

		await this.notificationsService.addNotification({
			userId: employer.userId,
			title: 'You have a new job review',
			content: `User ${talent?.name} responded to your vacancy ${job.title}`,
			group: NotificationsGroup.Applicants,
			isPushMuted: null,
			imageUrl: await this.getImage(payload.talentId, 'talents'),
			data: {
				talentId: talent.userId,
				type: NotificationType.NewApplication,
			},
		});
	}

	@OnEvent(Events.RejectApplication)
	public async onRejectApplication(payload: IEventsPayloads['RejectApplication']) {
		// const employer = await this.employerRepository.findOne({
		// 	where: { userId: payload.employerId },
		// })

		const job = await this.jobRepository.findOne({ where: { id: payload.jobId } });

		await this.notificationsService.addNotification({
			userId: payload.talentId,
			title: 'Your feedback on the vacancy has been rejected',
			content: `Your application for ${job.title} was rejected`,
			group: NotificationsGroup.Applicants,
			isPushMuted: null,
			imageUrl: await this.getImage(payload.employerId, 'employers'),
			data: {
				jobId: payload.jobId,
				type: NotificationType.RejectApplication,
			},
		});
	}

	@OnEvent(Events.AcceptApplication)
	public async acceptApplication({ applicationId }: ApplicationAccept) {
		const application = await this.applicationRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.job', 'job')
			.leftJoinAndSelect('it.employer', 'employer')
			.leftJoinAndSelect('it.talent', 'talent')
			.where('it.id = :id', { id: applicationId })
			.getOne();

		await this.notificationsService.addNotification({
			userId: application?.talent?.userId,
			title: 'You have been accepted for the vacancy',
			content: `Your application for ${application?.job?.title} was accepted`,
			group: NotificationsGroup.Applicants,
			isPushMuted: null,
			imageUrl: await this.getImage(application?.employer?.userId, 'employers'),
			data: {
				employerId: application?.employer?.userId,
				type: NotificationType.AcceptedApplication,
			},
		});
	}

	@OnEvent(Events.LikeTalent)
	public async likeTalent(payload: IEventsPayloads['LikeTalent']) {
		const employer = await this.employerRepository.findOne({
			where: { userId: payload.employerId },
		});

		const message = payload.like ? 'liked you“' : 'unliked you';

		await this.notificationsService.addNotification({
			userId: payload.talentId,
			title: 'You have received a new notification',
			content: `${employer.name} ${message}`,
			group: NotificationsGroup.Like,
			isPushMuted: null,
			imageUrl: await this.getImage(employer.userId, 'employers'),
			data: {
				employerId: employer.userId,
				type: NotificationType.LikeTalent,
			},
		});
	}

	@OnEvent(Events.ViewTalent)
	public async viewTalent(payload: IEventsPayloads['ViewTalent']) {
		const employer = await this.employerRepository.findOne({
			where: { userId: payload.employerId },
		});
		if (!employer) return;
		await this.notificationsService.addNotification({
			userId: payload.talentId,
			title: 'Someone viewed your profile',
			content: `${employer?.name} has looked your profile `,
			group: NotificationsGroup.Other,
			isPushMuted: null,
			imageUrl: await this.getImage(employer.userId, 'employers'),
			data: {
				employerId: employer.userId,
				type: NotificationType.Other,
			},
		});
	}
}
