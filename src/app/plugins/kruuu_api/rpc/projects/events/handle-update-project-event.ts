import { Injectable } from '@nestjs/common';
import { BlockUpdateEventListener, HandleData } from '~api/shared';

@Injectable()
export class HandleUpdateProjectEvent extends BlockUpdateEventListener {
	protected listenEvent = 'updateProject';

	protected async handle(data: HandleData) {
		console.log('Handle update project', data);
	}
}
