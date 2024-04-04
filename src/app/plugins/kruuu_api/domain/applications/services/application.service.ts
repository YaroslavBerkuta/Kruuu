import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';

import {
	ApplicationStatus,
	APPLICATIONS_REPOSITORY,
	IApplicationRepository,
	IApplicationService,
	IStoreApplicationPayload,
	IUpdateApplicationPayload,
	IApplication,
} from '../typing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '~api/shared';
import { JOB_REPOSITORY } from '~api/domain/jobs/consts';
import { IJobRepository } from '~api/domain/jobs/typing';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { PROJECTS_SERVICES } from '~api/domain/projects/consts';
import { IProjectsService } from '~api/domain/projects/typing';
import { noop } from 'lodash';

@Injectable()
export class ApplicationService implements IApplicationService {
	@Inject(APPLICATIONS_REPOSITORY)
	private readonly applicationRepository: IApplicationRepository;

	@Inject(JOB_REPOSITORY)
	private readonly jobRepository: IJobRepository;

	@Inject(REAL_TIME_SERVICE)
	private readonly wsService: WSService;

	@Inject(PROJECTS_SERVICES)
	private readonly projectsService: IProjectsService;

	constructor(private eventEmitter: EventEmitter2) {}

	public async create(payload: IStoreApplicationPayload) {
		try {
			const job = await this.jobRepository
				.createQueryBuilder('it')
				.leftJoinAndSelect('it.project', 'project')
				.where('it.id = :id', { id: payload.jobId })
				.getOne();

			const exist = await this.applicationRepository.findOne({
				where: {
					talentId: payload.talentId,
					jobId: payload.jobId,
				},
			});

			if (exist) throw new ForbiddenException('you already submitted');

			const application = await this.applicationRepository.save({
				status: ApplicationStatus.Applicants,
				talentId: payload.talentId,
				jobId: payload.jobId,
				employerId: job.project.creatorId,
			});

			try {
				this.eventEmitter.emit(Events.NewApplication, {
					talentId: payload.talentId,
					employerId: job.project.creatorId,
					jobId: payload.jobId,
				});

				this.wsService.emitToUser(job.project.creatorId, 'createAccept');
				this.wsService.emitToUser(application.talentId, 'createApplication');
			} catch (e) {
				console.log('Error send events after apply job', e);
			}

			return application;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	public async updateStatus(payload: IUpdateApplicationPayload) {
		const application = await this.applicationRepository.findOne({
			where: { id: payload.applicationId },
		});

		if (
			application.status == ApplicationStatus.Accepted ||
			application.status == ApplicationStatus.Rejected
		) {
			throw new BadRequestException('status invalid');
		}

		const result = await this.applicationRepository.update(payload.applicationId, {
			status: payload.status,
		});

		this.changeStatusHandlers[application.status](application);

		return result;
	}

	private changeStatusHandlers = {
		[ApplicationStatus.Accepted]: this.onAcceptApplication.bind(this),
		[ApplicationStatus.Rejected]: this.onRejectApplication.bind(this),
		[ApplicationStatus.Applicants]: noop,
	};

	private async onAcceptApplication(application: IApplication) {
		const job = await this.jobRepository.findOneBy({ id: application.jobId });
		await this.projectsService.addUserToProject(job.projectId, application.talentId);
	}

	private onRejectApplication(application: IApplication) {
		this.eventEmitter.emit(Events.RejectApplication, {
			talentId: application.talentId,
			employerId: application.employerId,
			jobId: application.jobId,
		});
	}
}
