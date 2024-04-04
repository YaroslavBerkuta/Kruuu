import { BaseMethod, GenesisConfig, MethodContext } from 'lisk-sdk';
import { ProjectStore } from './stores/project';
import { COLLECTION_INDEX_LENGTH } from './constants/chain';

export class FreelancingMethod extends BaseMethod {
	private _config!: GenesisConfig;

	public init(config: GenesisConfig): void {
		this._config = config;
	}

	public async getNextAvailableIndex(methodContext: MethodContext): Promise<bigint> {
		const chainID = Buffer.from(this._config.chainID, 'hex');
		const projectSubstore = this.stores.get(ProjectStore);

		const projectStoreData = await projectSubstore.iterate(methodContext, {
			gte: Buffer.concat([chainID, Buffer.alloc(COLLECTION_INDEX_LENGTH, 0)]),
			lte: Buffer.concat([chainID, Buffer.alloc(COLLECTION_INDEX_LENGTH, 255)]),
		});

		if (projectStoreData.length === 0) {
			return BigInt(0);
		}

		const latestKey = projectStoreData[projectStoreData.length - 1].key;
		const indexBytes = latestKey.slice(chainID.length);
		const index = indexBytes.readBigUInt64BE();
		const largestIndex = BigInt(BigInt(2 ** 64) - BigInt(1));

		if (index === largestIndex) {
			throw new Error('No more available indexes');
		}

		return index + BigInt(1);
	}
}
