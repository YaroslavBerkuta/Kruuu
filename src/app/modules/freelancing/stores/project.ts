import { BaseStore, ImmutableStoreGetter, JSONObject, utils } from 'lisk-sdk';
import { NotFoundError } from '@liskhq/lisk-db';
import { projectStoreSchema } from '../schema/stores/project';

export interface Updates {
	type: string;
	author: string;
	transaction: Buffer;
	properties: Properties[];
}

export interface Properties {
	key: string;
	value: string;
}

export interface ProjectStoreData {
	did: string;
	employer: string;
	talents: {
		subject: string;
		properties: Properties[];
	}[];
	updates: Updates[];
	properties: Properties[];
}

export type ProjectStoreDataJSON = JSONObject<ProjectStoreData>;

export class ProjectStore extends BaseStore<ProjectStoreData> {
	public schema = projectStoreSchema;

	public readonly default: ProjectStoreData = {
		did: '',
		employer: '',
		talents: [],
		updates: [],
		properties: [],
	};

	public getKey(chainId: Buffer, projectId: bigint): Buffer {
		const buf = Buffer.alloc(8);
		buf.writeBigUInt64BE(projectId);
		return Buffer.concat([chainId, buf]);
	}

	public async getOrDefault(context: ImmutableStoreGetter, key: Buffer): Promise<ProjectStoreData> {
		try {
			const account = await this.get(context, key);
			return account;
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}
			return utils.objects.cloneDeep(this.default);
		}
	}

	public async getOrUndefined(
		context: ImmutableStoreGetter,
		key: Buffer,
	): Promise<ProjectStoreData | undefined> {
		try {
			const account = await this.get(context, key);
			return account;
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}
			return undefined;
		}
	}
}
