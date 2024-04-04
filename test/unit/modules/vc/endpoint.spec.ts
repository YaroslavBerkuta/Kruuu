/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BaseEndpoint, ModuleEndpointContext, testing } from 'lisk-sdk';
import { VcModule } from '../../../../src/app/modules/vc/module';
import { VcEndpoint } from '../../../../src/app/modules/vc/endpoint';
import { VCStateStore, vcStoreKey } from '../../../../src/app/modules/vc/stores/vcStore';
import { PrefixedStateReadWriter } from '../../../../node_modules/lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { validParam } from './constants/doc';

describe('VcEndpoint', () => {
	let context: ModuleEndpointContext;
	let module: VcModule;
	let endpoint: VcEndpoint;
	let stateStore: PrefixedStateReadWriter;
	let vcSubstore: VCStateStore;

	beforeEach(async () => {
		module = new VcModule();
		endpoint = module.endpoint;
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		vcSubstore = module.stores.get(VCStateStore);
		context = testing.createTransientMethodContext({ stateStore }) as any;
		await vcSubstore.set(context as any, vcStoreKey(validParam.id), {
			docBytes: validParam.docBytes,
		});
	});

	it('should inherit from BaseEndpoint', () => {
		expect(VcEndpoint.prototype).toBeInstanceOf(BaseEndpoint);
	});

	describe('constructor', () => {
		it('should be of the correct type', () => {
			expect(endpoint).toBeInstanceOf(VcEndpoint);
		});

		it("should expose 'read'", () => {
			expect(typeof endpoint.read).toBe('function');
		});
	});

	describe('read', () => {
		it('should get specified doc', async () => {
			const param = { id: validParam.id };
			context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
			const doc = await endpoint.read(context);
			expect(doc).toStrictEqual({ docBytes: validParam.docBytes.toString('hex') });
		});

		it('should throw an error if param.id is not a string', async () => {
			const func = async () => {
				const param = { id: 1 };
				context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
				await endpoint.read(context);
			};
			await expect(func()).rejects.toThrow();
		});
	});
});
