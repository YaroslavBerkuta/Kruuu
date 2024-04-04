import { Inject } from '@nestjs/common';
import { apiClient } from 'lisk-sdk';
import * as _ from 'lodash';
import { CORE_API } from '../consts';

export abstract class BlockListener {
	@Inject(CORE_API)
	protected coreApi: apiClient.APIClient;

	protected abstract listenModule: string;

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
			{ module: this.listenModule },
		);
	}

	protected abstract onEvent(event: any): void;
}
