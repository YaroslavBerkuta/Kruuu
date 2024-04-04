/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/member-ordering */

import { BaseModule, ModuleInitArgs, ModuleMetadata } from 'lisk-sdk';
import { AddTalentsCommand } from './commands/add_talents_command';
import { AddUpdatesCommand } from './commands/add_updates_command';
import { CreateProjectCommand } from './commands/create_project_command';
import { FreelancingEndpoint } from './endpoint';
import { FreelancingMethod } from './method';
import { DidMethod } from 'lisk-did';
import { AccountStore } from './stores/account';
import { ProjectStore } from './stores/project';
import { NewUpdatesEvent } from './events/new_updates';
import {
	getAccountRequestSchema,
	getAccountResponseSchema,
	getProjectListRequestSchema,
	getProjectListResponseSchema,
	getProjectRequestSchema,
	getProjectResponseSchema,
} from './schema/endpoint';

export class FreelancingModule extends BaseModule {
	public endpoint = new FreelancingEndpoint(this.stores, this.offchainStores);
	public method = new FreelancingMethod(this.stores, this.events);

	private _createProjectCommand = new CreateProjectCommand(this.stores, this.events);
	private _addTalentsCommand = new AddTalentsCommand(this.stores, this.events);
	private _addUpdatesCommand = new AddUpdatesCommand(this.stores, this.events);
	public commands = [this._createProjectCommand, this._addTalentsCommand, this._addUpdatesCommand];

	public addDependencies(didMethod: DidMethod) {
		this._createProjectCommand.addDependencies(didMethod, this.method);
		this._addTalentsCommand.addDependencies(didMethod);
		this._addUpdatesCommand.addDependencies(didMethod);
		this.endpoint.addDependencies(didMethod);
	}

	public constructor() {
		super();
		// registeration of stores and events

		this.stores.register(AccountStore, new AccountStore(this.name, 0));
		this.stores.register(ProjectStore, new ProjectStore(this.name, 1));

		this.events.register(NewUpdatesEvent, new NewUpdatesEvent(this.name));
	}

	public metadata(): ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [
				{
					name: this.endpoint.getAccount.name,
					request: getAccountRequestSchema,
					response: getAccountResponseSchema,
				},
				{
					name: this.endpoint.getProject.name,
					request: getProjectRequestSchema,
					response: getProjectResponseSchema,
				},
				{
					name: this.endpoint.getProjectList.name,
					request: getProjectListRequestSchema,
					response: getProjectListResponseSchema,
				},
			],
			assets: [],
		};
	}

	public async init(args: ModuleInitArgs): Promise<void> {
		this.method.init(args.genesisConfig);
		this.endpoint.init(args.genesisConfig);
	}
}
