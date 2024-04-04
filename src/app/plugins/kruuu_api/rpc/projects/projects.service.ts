import { Inject, Injectable } from '@nestjs/common';
import { apiClient, cryptography } from 'lisk-sdk';
import { PROJECTS_REPOSITORY, PROJECTS_SERVICES } from '~api/domain/projects/consts';
import { IProject, IProjectsService } from '~api/domain/projects/typing';
import { USERS_SERVICE, IUsersService } from '~api/domain/users/typing';
import { CORE_API } from '~api/shared';
import { transformBlockhainProject } from './transforms';
import * as ldid from '@lisk-did/lisk-decentralized-identifier';
import { IProjectsRepository } from '~api/domain/projects/interfaces';

@Injectable()
export class RpcProjectsService {
	@Inject(CORE_API)
	protected coreApi: apiClient.APIClient;

	@Inject(USERS_SERVICE)
	private readonly usersService: IUsersService;

	@Inject(PROJECTS_SERVICES)
	private readonly projectsService: IProjectsService;

	@Inject(PROJECTS_REPOSITORY)
	private readonly projectsRepository: IProjectsRepository;

	public onModuleInit() {
		this.autoSyncPrevious();
	}

	private async autoSyncPrevious() {
		const data: { projects: any[] } = await this.coreApi.invoke('freelancing_getProjectList', {
			offset: 0,
			limit: 30,
		});

		for await (const item of data.projects) {
			await this.sync(item.did);
		}
	}

	public async sync(projectDid: string) {
		try {
			await this.syncExecute(projectDid);
		} catch (e) {
			console.log(e);
		}
	}

	private async syncExecute(projectDid: string) {
		const blockProjectData: any = await this.getBlockProjectData(projectDid);
		const exist = await this.getExistProject(projectDid);

		if (!this.checkNeedUpdate(blockProjectData, exist)) return;

		blockProjectData.properties = getActualObject(
			blockProjectData.properties,
			blockProjectData.updates,
		);

		const employerUserId = await this.getEmployerUserId(String(blockProjectData.employer));
		const projectPayload = transformBlockhainProject(projectDid, blockProjectData, employerUserId);

		if (exist) {
			await this.projectsService.update(exist.id, projectPayload);
		} else {
			await this.projectsService.store(projectPayload);
		}
	}

	private async getBlockProjectData(projectDid: string) {
		const blockProjectData = await this.coreApi.invoke('freelancing_getProject', {
			project: projectDid,
		});
		if (!blockProjectData) throw new Error('Project not founded');
		return blockProjectData;
	}

	private async getExistProject(projectDid: string) {
		const existProject = await this.projectsRepository.findOneBy({ blochaineUuid: projectDid });
		return existProject;
	}

	private async getEmployerUserId(employerDid: string) {
		try {
			const publicKey = await this.getEmployerPublickKey(employerDid);
			const user = await this.usersService.getUserByPublicAddress(publicKey);
			return user.id;
		} catch (e) {
			throw new Error('Employer not founded');
		}
	}

	private async getEmployerPublickKey(employerDid: string) {
		const employerDidComponents = ldid.parseDIDComponent(employerDid);
		const employerLisk32Adress = employerDidComponents.uniqueId;
		const employerPublicKey =
			cryptography.address.getAddressFromLisk32Address(employerLisk32Adress);

		return employerPublicKey.toString('hex');
	}

	private checkNeedUpdate(blockProjectData: any, project: IProject) {
		if (!project) return true;
		const updatesCount = (blockProjectData.updates as any[]).length;

		console.log('updatescount', updatesCount, project.meta.blockUpdatesCount);
		return !project || updatesCount > project.meta.blockUpdatesCount;
	}
}

function getActualObject(properties, updates) {
	const actualObject = {};

	properties.forEach(property => {
		actualObject[property.key] = property.value;
	});

	for (let i = updates.length - 1; i >= 0; i--) {
		const update = updates[i];
		update.properties.forEach(property => {
			actualObject[property.key] = property.value;
		});
	}

	const resultArray = Object.keys(actualObject).map(key => {
		return { key: key, value: actualObject[key] };
	});

	return resultArray;
}
