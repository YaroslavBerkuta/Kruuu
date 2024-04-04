import { Injectable } from '@nestjs/common';
import { CREATE_PROJECT_UPDATES } from 'app/modules/freelancing/constants/events';
import { BlockUpdateEventListener, HandleData } from '~api/shared';
import { RpcProjectsService } from '../projects.service';

@Injectable()
export class HandleCreateProjectEvent extends BlockUpdateEventListener {
	protected listenEvent = CREATE_PROJECT_UPDATES;

	constructor(private readonly rpcProjectsService: RpcProjectsService) {
		super();
	}

	protected async handle(data: HandleData) {
		const projectDid = data.properties.find(it => it.key === 'did')?.value;
		await this.rpcProjectsService.sync(projectDid);
	}
}
