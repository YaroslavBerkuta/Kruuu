import { BaseStore, ImmutableStoreGetter, JSONObject, StoreGetter, utils } from 'lisk-sdk';
import { NotFoundError } from '@liskhq/lisk-db';
import { accountStoreSchema } from '../schema/stores/account';
import { did } from 'lisk-did';

export interface AccountStoreData {
	employerOf: string[];
	talentOf: string[];
}

export type AccountStoreDataJSON = JSONObject<AccountStoreData>;

export class AccountStore extends BaseStore<AccountStoreData> {
	public schema = accountStoreSchema;

	public readonly default: AccountStoreData = {
		employerOf: [],
		talentOf: [],
	};

	private preprocessKey(key: Buffer) {
		return Buffer.from(did.parseDIDComponent(key.toString('utf-8')).uri, 'utf-8');
	}

	public getKey(did: string): Buffer {
		return Buffer.from(did, 'utf-8');
	}

	public async get(ctx: ImmutableStoreGetter, key: Buffer): Promise<AccountStoreData> {
		if (!this.schema) {
			throw new Error('Schema is not set');
		}
		const did = this.preprocessKey(key);
		const subStore = ctx.getStore(this.storePrefix, this.subStorePrefix);
		return await subStore.getWithSchema<AccountStoreData>(did, this.schema);
	}

	public async set(ctx: StoreGetter, key: Buffer, value: AccountStoreData): Promise<void> {
		if (!this.schema) {
			throw new Error('Schema is not set');
		}
		const did = this.preprocessKey(key);
		const subStore = ctx.getStore(this.storePrefix, this.subStorePrefix);
		await subStore.setWithSchema(did, value, this.schema);
	}

	public async getOrDefault(context: ImmutableStoreGetter, key: Buffer): Promise<AccountStoreData> {
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
	): Promise<AccountStoreData | undefined> {
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
