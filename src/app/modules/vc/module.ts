/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */

import { BaseModule, ModuleMetadata } from 'lisk-sdk';
import { StoreCommand } from './commands/store_command';
import { VcEndpoint } from './endpoint';
import { VcMethod } from './method';
import { VCStateStore } from './stores/vcStore';
import { VCStoreEvent } from './events/store_event';

export class VcModule extends BaseModule {
	public endpoint = new VcEndpoint(this.stores, this.offchainStores);
	public method = new VcMethod(this.stores, this.events);
	public commands = [new StoreCommand(this.stores, this.events)];

	public constructor() {
		super();
		// registeration of stores and events

		this.stores.register(VCStateStore, new VCStateStore(this.name, 0));
		this.events.register(VCStoreEvent, new VCStoreEvent(this.name));
	}

	public metadata(): ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [],
			assets: [],
		};
	}
}
