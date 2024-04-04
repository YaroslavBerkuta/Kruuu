import { Inject } from '@nestjs/common';
import { CORE_API } from '../consts';
import { apiClient } from 'lisk-sdk';
import * as _ from 'lodash';
import { DecodedEventJSON } from '@liskhq/lisk-api-client/dist-node/types';

export abstract class BlockUpdateEventListener {
	@Inject(CORE_API)
	protected coreApi: apiClient.APIClient;

	protected abstract listenEvent: string;

	public onModuleInit() {
		this.subscribe();
	}

	private subscribe() {
		this.coreApi.event.subscribe(
			events => {
				if (_.isEmpty(events)) return null;
				events.map(eventData => this.onEvent(eventData));
				return null;
			},
			{ module: 'freelancing' },
		);
	}

	private onEvent(event: DecodedEventJSON) {
		console.log('New event', event.name);
		const updates: HandleData[] = event.data.updates as any;

		if (!Array.isArray(updates)) return;

		updates.map(data => {
			if (this.listenEvent === data.type) this.handle(data);
		});
	}

	protected abstract handle(data: HandleData): any;
}

export interface HandleData {
	type: string;
	author: string;
	transaction: string;
	properties: any;
}
