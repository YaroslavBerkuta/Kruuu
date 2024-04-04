import { Injectable } from '@nestjs/common';
import { BlockUpdateEventListener, HandleData } from '~api/shared';
import { RpcProjectsService } from '../projects.service';
import { ADD_TALENTS_UPDATES } from 'app/modules/freelancing/constants/events';

@Injectable()
export class HandleAddTalentsEvent extends BlockUpdateEventListener {
	protected listenEvent = ADD_TALENTS_UPDATES;

	constructor(private readonly rpcProjectsService: RpcProjectsService) {
		super();
	}

	protected async handle(data: HandleData) {
		const projectDid = data.properties.find(it => it.key === 'did')?.value;
		await this.rpcProjectsService.sync(projectDid);
	}
}
