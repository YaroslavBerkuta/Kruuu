/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BaseMethod, MethodContext, testing } from 'lisk-sdk';
import { FreelancingMethod } from '../../../../src/app/modules/freelancing/method';
import { FreelancingModule } from '../../../../src/app/modules/freelancing/module';
import { PrefixedStateReadWriter } from '../../../../node_modules/lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { ProjectStore } from '../../../../src/app/modules/freelancing/stores/project';
import { chainID, moduleConfig } from './constants/config';
import { projectData, projectId } from './constants/project';

describe('FreelancingMethod', () => {
	let context: MethodContext;
	let module: FreelancingModule;
	let method: FreelancingMethod;
	let stateStore: PrefixedStateReadWriter;
	let projectSubstore: ProjectStore;

	afterEach(jest.clearAllMocks);

	beforeEach(async () => {
		module = new FreelancingModule();
		method = module.method;
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		projectSubstore = module.stores.get(ProjectStore);
		context = testing.createTransientMethodContext({ stateStore });
		await projectSubstore.set(
			context as any,
			projectSubstore.getKey(chainID, projectId),
			projectData,
		);
		await projectSubstore.set(
			context as any,
			projectSubstore.getKey(chainID, projectId + BigInt(1)),
			projectData,
		);
		await projectSubstore.set(
			context as any,
			projectSubstore.getKey(chainID, projectId + BigInt(2)),
			projectData,
		);
		method.init(moduleConfig.genesisConfig as any);
	});

	it('should inherit from BaseMethod', () => {
		expect(FreelancingMethod.prototype).toBeInstanceOf(BaseMethod);
	});

	describe('constructor', () => {
		it('should be of the correct type', () => {
			expect(method).toBeInstanceOf(FreelancingMethod);
		});

		it("should expose 'init'", () => {
			expect(typeof method.init).toBe('function');
		});

		it("should expose 'getNextAvailableIndex'", () => {
			expect(typeof method.getNextAvailableIndex).toBe('function');
		});
	});

	describe('init', () => {
		it('should set the config accordingly', () => {
			method.init(moduleConfig.genesisConfig as any);
			expect(method['_config']).toStrictEqual(moduleConfig.genesisConfig);
		});
	});

	describe('getNextAvailableIndex', () => {
		it('should return next available project id', async () => {
			const next = await method.getNextAvailableIndex(context);
			expect(Number(next)).toBe(3);
		});

		it('should return zero if store is empty', async () => {
			await projectSubstore.del(context, projectSubstore.getKey(chainID, projectId));
			await projectSubstore.del(context, projectSubstore.getKey(chainID, projectId + BigInt(1)));
			await projectSubstore.del(context, projectSubstore.getKey(chainID, projectId + BigInt(2)));
			const next = await method.getNextAvailableIndex(context);
			expect(Number(next)).toBe(0);
		});

		it('should throw an error if run out of available index', async () => {
			const func = async () => {
				await projectSubstore.set(
					context as any,
					projectSubstore.getKey(chainID, BigInt(BigInt(2 ** 64) - BigInt(1))),
					projectData,
				);
				await method.getNextAvailableIndex(context);
			};
			await expect(func()).rejects.toThrow();
		});
	});
});
