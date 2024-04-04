/* eslint-disable import/no-extraneous-dependencies */
import { StoreGetter, testing } from 'lisk-sdk';
import { PrefixedStateReadWriter } from 'lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { FreelancingModule } from '../../../../../src/app/modules/freelancing/module';
import { createStoreGetter } from '../../../../utils/store';
import { AccountStore } from '../../../../../src/app/modules/freelancing/stores/account';
import { employerAccount, employerDid, talent1Account, talent1Did } from '../constants/account';

describe('AccountStore', () => {
	let stateStore: PrefixedStateReadWriter;
	let module: FreelancingModule;
	let store: StoreGetter;
	let accountSubstore: AccountStore;

	beforeEach(async () => {
		module = new FreelancingModule();
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		accountSubstore = module.stores.get(AccountStore);
		store = createStoreGetter(stateStore);
		await accountSubstore.set(store, accountSubstore.getKey(talent1Did), talent1Account);
	});

	describe('get', () => {
		it('should throw an error if schema is not set', async () => {
			const func = async () => {
				accountSubstore.schema = undefined as any;
				await accountSubstore.get(store, accountSubstore.getKey(employerDid));
			};
			await expect(func()).rejects.toThrow();
		});
	});

	describe('set', () => {
		it('should throw an error if schema is not set', async () => {
			const func = async () => {
				accountSubstore.schema = undefined as any;
				await accountSubstore.set(store, accountSubstore.getKey(employerDid), employerAccount);
			};
			await expect(func()).rejects.toThrow();
		});
	});

	describe('getOrDefault', () => {
		it('should return default value if not exists', async () => {
			const def = await accountSubstore.getOrDefault(store, accountSubstore.getKey(employerDid));
			expect(def).toStrictEqual(accountSubstore.default);
		});

		it('should throw an error if error thrown is not NotFoundError', async () => {
			jest.spyOn(accountSubstore, 'get').mockImplementation(() => {
				throw new Error('not a NotFoundError');
			});
			const func = async () => {
				await accountSubstore.getOrDefault(store, accountSubstore.getKey(employerDid));
			};
			await expect(func()).rejects.toThrow();
		});
	});

	describe('getOrUndefined', () => {
		it('should return account state', async () => {
			const acc = await accountSubstore.getOrUndefined(store, accountSubstore.getKey(talent1Did));
			expect(acc).toStrictEqual(talent1Account);
		});

		it('should return undefined if not exists', async () => {
			const def = await accountSubstore.getOrUndefined(store, accountSubstore.getKey(employerDid));
			expect(def).toBeUndefined();
		});

		it('should throw an error if error thrown is not NotFoundError', async () => {
			jest.spyOn(accountSubstore, 'get').mockImplementation(() => {
				throw new Error('not a NotFoundError');
			});
			const func = async () => {
				await accountSubstore.getOrUndefined(store, accountSubstore.getKey(employerDid));
			};
			await expect(func()).rejects.toThrow();
		});
	});
});
