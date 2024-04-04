import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
	JOB_APPEARANCE_REPOSITORY,
	JOB_MEASUREMENT_REPOSITORY,
	JOB_REPOSITORY,
	JOB_RESIDENCE_REPOSITORY,
	JOB_TO_TAG_REPOSITORY,
} from '../consts';
import {
	IJobAppearanceRepository,
	IJobMeasurementRepository,
	IJobRepository,
	IJobsResidenceRepository,
	IJobToTagRepository,
} from '../typing';
import { isEmpty, omitBy, omit, isNil, noop } from 'lodash';
import {
	IJobService,
	IJobsStorePayload,
	IJobUpdatePayload,
	IStoreJobAppearancePayload,
	IStoreJobMeasurementPayload,
} from '../typing';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { PROJECTS_REPOSITORY } from '~api/domain/projects/consts';
import { IProjectsRepository } from '~api/domain/projects/interfaces';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import { JobStatus } from '../typing/enums';

@Injectable()
export class JobService implements IJobService {
	@Inject(JOB_REPOSITORY) private readonly jobRepository: IJobRepository;
	@Inject(JOB_APPEARANCE_REPOSITORY)
	private readonly jobAppearanceRepository: IJobAppearanceRepository;
	@Inject(JOB_MEASUREMENT_REPOSITORY)
	private readonly jobMeasurementRepository: IJobMeasurementRepository;
	@Inject(JOB_RESIDENCE_REPOSITORY)
	private readonly jobsResidenceRepository: IJobsResidenceRepository;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;

	@Inject(PROJECTS_REPOSITORY)
	private readonly projectsRepository: IProjectsRepository;

	@Inject(JOB_TO_TAG_REPOSITORY) private readonly jobToTagRepository: IJobToTagRepository;

	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;

	public async changeStatus(
		id: number,
		status: JobStatus.InProgress | JobStatus.Finished,
	): Promise<void> {
		const job = await this.jobRepository.findOne({
			where: { id },
		});
		if (!job) return;

		await this.jobRepository.update(id, { status });
	}

	public async getOneJob(id: number) {
		const job = await this.jobRepository
			.createQueryBuilder('it')
			.leftJoinAndSelect('it.residence', 'residence')
			.leftJoinAndSelect('it.skills', 'skills')
			.where('it.id = :id', { id })
			.getOne();

		const appearance = await this.jobAppearanceRepository.findOne({ where: { jobId: job.id } });
		const measurement = await this.jobMeasurementRepository.findOne({
			where: { jobId: job.id },
		});

		return {
			...job,
			appearance,
			measurement,
		};
	}

	public async storeJob(payload: IJobsStorePayload) {
		const job = await this.jobRepository.save({
			projectId: payload.projectId,
			title: payload.title,
			industry: payload.industry,
			type: payload.type,
			job: payload.job,
			peopleNeeded: payload.peopleNeeded,
			experience: payload.experience,
			startingDate: payload.startingDate,
			duration: payload.duration,
			location: payload.location,
			description: payload.description,
			payment: payload.payment,
			currency: payload.currency,
			blochaineUuid: payload.blochaineUuid,
			uniqueKey: payload.uniqueKey,
		});

		if (!isEmpty(payload.skills)) {
			await this.saveSkills(job.id, payload.skills);
		}

		let appearance;
		if (!isEmpty(payload.appearance)) {
			appearance = await this.storeAppearance({
				...payload.appearance,
				jobId: job.id,
			});
		}

		let measurement;
		if (!isEmpty(payload.measurement)) {
			measurement = await this.storeMeasurement({
				...payload.measurement,
				jobId: job.id,
			});
		}

		let residence;

		if (!isEmpty(payload.residence)) {
			residence = await this.jobsResidenceRepository.save({
				jobId: job.id,
				nationality: payload.residence.nationality,
				residence: payload.residence.residence,
			});
		}

		try {
			const project = await this.projectsRepository.findOneBy({ id: job.projectId });
			this.wsService.emitToUser(project.creatorId, 'newJob');
		} catch (e) {
			console.log('error send event');
		}

		if (job.uniqueKey)
			this.galleryService.associateProccessFiles(job.uniqueKey, String(job.id), 'jobs').catch(noop);

		return { ...job, appearance, measurement, residence };
	}

	public async updateJob(id: number, payload: IJobUpdatePayload) {
		let job = await this.jobRepository.findOne({ where: { id }, relations: ['project'] });

		if (isEmpty(job)) throw new NotFoundException('job not find');

		let appearance = await this.jobAppearanceRepository.findOne({ where: { jobId: job.id } });
		let residence = await this.jobsResidenceRepository.findOne({ where: { jobId: job.id } });
		let measurement = await this.jobMeasurementRepository.findOne({ where: { jobId: job.id } });

		job = await this.jobRepository.merge(
			job,
			omitBy(
				omit({
					title: payload.title,
					industry: payload.industry,
					type: payload.type,
					job: payload.job,
					peopleNeeded: payload.peopleNeeded,
					experience: payload.experience,
					startingDate: payload.startingDate,
					duration: payload.duration,
					location: payload.location,
					description: payload.description,
					payment: payload.payment,
					currency: payload.currency,
				}),
				isNil,
			),
		);

		await this.jobRepository.update(id, job);

		if (!isEmpty(payload.appearance)) {
			appearance = await this.jobAppearanceRepository.merge(
				appearance,
				omitBy(
					omit({
						bodyType: payload.appearance.bodyType,
						height: payload.appearance.height,
						ethnic: payload.appearance.ethnic,
						eyeColor: payload.appearance.eyeColor,
						hairLength: payload.appearance.hairLength,
						hairColor: payload.appearance.hairColor,
					}),
					isNil,
				),
			);

			await this.jobAppearanceRepository.update(appearance.id, appearance);
		}

		if (!isEmpty(payload.residence)) {
			residence = await this.jobsResidenceRepository.merge(
				residence,
				omitBy(
					omit({
						nationality: payload.residence.nationality,
						residence: payload.residence.residence,
					}),
					isNil,
				),
			);
			await this.jobsResidenceRepository.update(residence.id, residence);
		}

		if (!isEmpty(payload.measurement)) {
			measurement = await this.jobMeasurementRepository.merge(
				measurement,
				omitBy(
					omit({
						top: payload.measurement.top,
						trousers: payload.measurement.trousers,
						shoes: payload.measurement.shoes,
					}),
					isNil,
				),
			);
			await this.jobMeasurementRepository.update(measurement.id, measurement);
		}

		if (!isEmpty(payload.skills)) {
			await this.saveSkills(job.id, payload.skills);
		}
		if (job.project) this.wsService.emitToUser(job.project.creatorId, 'newJob');
		return job;
	}

	public async deleteJob(id: number) {
		let job = await this.jobRepository.findOne({ where: { id } });
		await this.jobRepository.delete(job.id);
		this.wsService.emitToUser(job.project.creatorId, 'newJob');
	}

	private async storeAppearance(payload: IStoreJobAppearancePayload) {
		const appearance = await this.jobAppearanceRepository.save({
			bodyType: payload.bodyType,
			height: payload.height,
			ethnic: payload.ethnic,
			eyeColor: payload.eyeColor,
			hairLength: payload.hairLength,
			hairColor: payload.hairColor,
			jobId: payload.jobId,
		});

		return appearance;
	}

	private async storeMeasurement(payload: IStoreJobMeasurementPayload) {
		const measurement = await this.jobMeasurementRepository.save({
			top: payload.top,
			trousers: payload.trousers,
			shoes: payload.shoes,
			jobId: payload.jobId,
		});

		return measurement;
	}

	private async saveSkills(jobId: number, tagsId: number[]) {
		const skill = await this.jobToTagRepository.find({ where: { jobId } });

		if (!isEmpty(skill)) {
			await this.jobToTagRepository.delete(skill.map(it => it.id));
		}

		const toInsert = tagsId.map(tagId => ({ jobId, tagId }));

		await this.jobToTagRepository.insert(toInsert);
	}
}
