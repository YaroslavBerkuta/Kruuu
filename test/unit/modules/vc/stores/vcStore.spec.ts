/* eslint-disable import/no-extraneous-dependencies */
import { StoreGetter, testing } from 'lisk-sdk';
import { PrefixedStateReadWriter } from 'lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { createStoreGetter } from '../../../../utils/store';
import { VCStateStore, vcStoreKey } from '../../../../../src/app/modules/vc/stores/vcStore';
import { VcModule } from '../../../../../src/app/modules/vc/module';
import { validParam } from '../constants/doc';

describe('VCStateStore', () => {
	let stateStore: PrefixedStateReadWriter;
	let module: VcModule;
	let store: StoreGetter;
	let vcStore: VCStateStore;

	beforeEach(async () => {
		module = new VcModule();
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		vcStore = module.stores.get(VCStateStore);
		store = createStoreGetter(stateStore);
		await vcStore.set(store, vcStoreKey(validParam.id), { docBytes: validParam.docBytes });
	});

	describe('getOrDefault', () => {
		it('should return default value if not exists', async () => {
			const doc = await vcStore.getOrDefault(store, vcStoreKey('notexistdoc'));
			expect(doc).toStrictEqual(vcStore.default);
		});

		it('should throw an error if error thrown is not NotFoundError', async () => {
			jest.spyOn(vcStore, 'get').mockImplementation(() => {
				throw new Error('not a NotFoundError');
			});
			const func = async () => {
				await vcStore.getOrDefault(store, vcStoreKey(validParam.id));
			};
			await expect(func()).rejects.toThrow();
		});
	});
});
