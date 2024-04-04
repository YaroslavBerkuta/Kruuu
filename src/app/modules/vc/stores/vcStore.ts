import { BaseStore, ImmutableStoreGetter } from 'lisk-sdk';
import { NotFoundError } from '@liskhq/lisk-db';

export const vcStateStoreSchema = {
	$id: '/vc/store/state',
	type: 'object',
	required: ['docBytes'],
	properties: {
		docBytes: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
	},
};

export interface VCStateStoreData {
	docBytes: Buffer;
}

export class VCStateStore extends BaseStore<VCStateStoreData> {
	public schema = vcStateStoreSchema;
	public default: VCStateStoreData = { docBytes: Buffer.alloc(0) };

	public async getOrDefault(context: ImmutableStoreGetter, key: Buffer): Promise<VCStateStoreData> {
		try {
			const vc = await this.get(context, key);
			return vc;
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}
			return { docBytes: Buffer.alloc(0) };
		}
	}
}

export const vcStoreKey = (id: string) => {
	return Buffer.from(`${id}`, 'utf-8');
};
