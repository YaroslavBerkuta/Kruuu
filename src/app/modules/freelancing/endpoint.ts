import { BaseEndpoint, GenesisConfig, ModuleEndpointContext } from 'lisk-sdk';
import { DidMethod } from 'lisk-did';
import { AccountStore, AccountStoreDataJSON } from './stores/account';
import { serializer } from './utils/serializer';
import { ProjectStore, ProjectStoreDataJSON } from './stores/project';
import { getProjectIdentity } from './utils/did';
import { COLLECTION_INDEX_LENGTH } from './constants/chain';
import { createPagination } from './utils/pagination';

export class FreelancingEndpoint extends BaseEndpoint {
	private _config!: GenesisConfig;
	private _didMethod: DidMethod | undefined;

	public init(config: GenesisConfig): void {
		this._config = config;
	}

	public addDependencies(didMethod: DidMethod) {
		this._didMethod = didMethod;
	}

	public async getAccount(ctx: ModuleEndpointContext): Promise<AccountStoreDataJSON> {
		const { did } = ctx.params;
		if (typeof did !== 'string') throw new Error('Parameter did must be a string.');

		const accountSubstore = this.stores.get(AccountStore);
		const account = await accountSubstore.getOrDefault(ctx, accountSubstore.getKey(did));

		return serializer(account) as AccountStoreDataJSON;
	}

	public async getProject(ctx: ModuleEndpointContext): Promise<ProjectStoreDataJSON> {
		const { project } = ctx.params;
		if (typeof project !== 'string') throw new Error('Parameter project must be a string.');

		const didConfig = this._didMethod.getConfig();
		const { projectKey } = getProjectIdentity(didConfig.chainspace, project);

		const projectSubstore = this.stores.get(ProjectStore);
		const projectState = await projectSubstore.getOrDefault(ctx, projectKey);
		return serializer(projectState) as ProjectStoreDataJSON;
	}

	public async getProjectList(
		ctx: ModuleEndpointContext,
	): Promise<{ projects: ProjectStoreDataJSON[] }> {
		const { limit, offset } = ctx.params as Record<string, number | undefined>;

		if (limit && typeof limit !== 'number')
			throw new Error('If provided, parameter limit must be a number.');
		if (offset && typeof offset !== 'number')
			throw new Error('If provided, parameter offset must be a number.');

		const chainID = Buffer.from(this._config.chainID, 'hex');
		const projectSubstore = this.stores.get(ProjectStore);

		const projectStoreData = await projectSubstore.iterate(ctx, {
			gte: Buffer.concat([chainID, Buffer.alloc(COLLECTION_INDEX_LENGTH, 0)]),
			lte: Buffer.concat([chainID, Buffer.alloc(COLLECTION_INDEX_LENGTH, 255)]),
		});

		const { o, c } = createPagination(BigInt(projectStoreData.length), offset, limit);

		const projects = [];
		for (let i = o; i < c; i += BigInt(1)) {
			const project = await projectSubstore.getOrDefault(ctx, projectSubstore.getKey(chainID, i));
			projects.push(serializer(project));
		}

		return { projects };
	}
}
