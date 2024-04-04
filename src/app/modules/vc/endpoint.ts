import { BaseEndpoint, JSONObject, ModuleEndpointContext } from 'lisk-sdk';
import { VCStateStore, VCStateStoreData, vcStoreKey } from './stores/vcStore';

export class VcEndpoint extends BaseEndpoint {
	public async read(ctx: ModuleEndpointContext): Promise<JSONObject<VCStateStoreData>> {
		const { id } = ctx.params;
		if (typeof id !== 'string') throw new Error('Parameter id must be a string.');
		const vcStore = this.stores.get(VCStateStore);
		const key = vcStoreKey(id);
		const vc = await vcStore.getOrDefault(ctx, key);
		return { docBytes: vc.docBytes.toString('hex') };
	}
}
