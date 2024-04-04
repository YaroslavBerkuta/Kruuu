import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PROJECTS_REPOSITORY } from '../consts';
import { IProjectsRepository } from '../interfaces';
import * as _ from 'lodash';
import {
	IProjectsService,
	IStoreProjectPayload,
	IStoreSocialProjectPayload,
	IUpdateProjectPayload,
} from '../typing';
import { ISocialLinksService, SOCIAL_LINKS_SERVICE } from '~api/domain/social/typing';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '~api/shared';
import { GALLERY_SERVICE } from '~api/domain/galleries/consts';
import { IGalleryService } from '~api/domain/galleries/interface';
import { noop } from 'lodash';
import { ProjectStatus } from '../typing/enums';
import { BLOCK_API_SERVICE, IBlockApiService } from '~api/libs/blockchain/typing';

@Injectable()
export class ProjectService implements IProjectsService {
	@Inject(PROJECTS_REPOSITORY)
	private readonly projectsRepository: IProjectsRepository;

	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;

	@Inject(REAL_TIME_SERVICE)
	private wsService: WSService;

	@Inject(GALLERY_SERVICE)
	private readonly galleryService: IGalleryService;

	@Inject(BLOCK_API_SERVICE)
	private readonly blockApi: IBlockApiService;

	constructor(private eventEmitter: EventEmitter2) {}

	public async store(dto: IStoreProjectPayload) {
		const project = await this.projectsRepository.save({
			creatorId: dto.creatorId,
			title: dto.title,
			industryId: dto.industryId,
			typeId: dto.typeId,
			startingDate: dto.startingDate,
			duration: dto.duration,
			location: dto.location,
			descriptions: dto.descriptions,
			budget: dto.budget,
			blochaineUuid: dto.blochaineUuid,
			lockedTokenBeddows: _.defaultTo(dto.lockedTokenBeddows, '0'),
			uniqueKey: dto.uniqueKey,
		});

		try {
			this.wsService.emitToUser(project.creatorId, 'editProject');
			this.eventEmitter.emit(Events.ChangeProject, { projectId: project.id });
		} catch (e) {}

		if (project.uniqueKey) {
			this.galleryService
				.associateProccessFiles(project.uniqueKey, String(project.id), 'projects')
				.catch(noop);
		}

		return project;
	}

	public async update(id: number, dto: IUpdateProjectPayload) {
		let project = await this.projectsRepository.findOne({ where: { id } });

		if (_.isEmpty(project)) {
			throw new NotFoundException('project not found');
		}

		project = await this.projectsRepository.merge(project, _.omitBy(_.omit(dto), _.isNil));

		await this.projectsRepository.update(id, project);

		this.wsService.emitToUser(project.creatorId, 'editProject');
		return project;
	}

	public async delete(id: number) {
		const project = await this.projectsRepository.findOneBy({ id });
		await this.projectsRepository.delete(project.id);
		this.wsService.emitToUser(project.creatorId, 'editProject');
		return;
	}

	public async storeSocial(id: number, payload: IStoreSocialProjectPayload) {
		await this.socialLinksService.put({
			parentType: 'project',
			parentId: id,
			items: payload.items,
		});
	}

	public async close(id: number): Promise<void> {
		await this.projectsRepository.update(id, { status: ProjectStatus.Closed });
	}

	public async addUserToProject(projectId: number, userId: number): Promise<void> {
		const project = await this.projectsRepository.findOne({
			where: {
				id: projectId,
			},
			select: ['blochaineUuid'],
		});
		const userDid = await this.blockApi.getUserDID(userId);

		await this.blockApi.createUserSignedTx(userId, {
			command: 'addTalents',
			params: {
				project: project.blochaineUuid,
				talents: [
					{
						subject: userDid,
						properties: [],
					},
				],
				signature: Buffer.alloc(0),
			},
		});
	}
}
