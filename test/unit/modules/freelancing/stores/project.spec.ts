/* eslint-disable import/no-extraneous-dependencies */
import { StoreGetter, testing } from 'lisk-sdk';
import { PrefixedStateReadWriter } from 'lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { FreelancingModule } from '../../../../../src/app/modules/freelancing/module';
import { ProjectStore } from '../../../../../src/app/modules/freelancing/stores/project';
import { createStoreGetter } from '../../../../utils/store';
import { chainID } from '../constants/config';
import { projectId } from '../constants/project';

describe('ProjectStore', () => {
	let stateStore: PrefixedStateReadWriter;
	let module: FreelancingModule;
	let store: StoreGetter;
	let projectSubstore: ProjectStore;

	beforeEach(() => {
		module = new FreelancingModule();
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		projectSubstore = module.stores.get(ProjectStore);
		store = createStoreGetter(stateStore);
	});

	describe('getOrDefault', () => {
		it('should return default value if not exists', async () => {
			const def = await projectSubstore.getOrDefault(
				store,
				projectSubstore.getKey(chainID, BigInt(10)),
			);
			expect(def).toStrictEqual(projectSubstore.default);
		});

		it('should throw an error if error thrown is not NotFoundError', async () => {
			jest.spyOn(projectSubstore, 'get').mockImplementation(() => {
				throw new Error('not a NotFoundError');
			});
			const func = async () => {
				await projectSubstore.getOrDefault(store, projectSubstore.getKey(chainID, projectId));
			};
			await expect(func()).rejects.toThrow();
		});
	});

	describe('getOrUndefined', () => {
		it('should return undefined if not exists', async () => {
			const def = await projectSubstore.getOrUndefined(
				store,
				projectSubstore.getKey(chainID, BigInt(10)),
			);
			expect(def).toBeUndefined();
		});

		it('should throw an error if error thrown is not NotFoundError', async () => {
			jest.spyOn(projectSubstore, 'get').mockImplementation(() => {
				throw new Error('not a NotFoundError');
			});
			const func = async () => {
				await projectSubstore.getOrUndefined(store, projectSubstore.getKey(chainID, projectId));
			};
			await expect(func()).rejects.toThrow();
		});
	});
});
