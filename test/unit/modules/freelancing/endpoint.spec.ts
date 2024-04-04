/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BaseEndpoint, ModuleEndpointContext, testing } from 'lisk-sdk';
import { FreelancingEndpoint } from '../../../../src/app/modules/freelancing/endpoint';
import { FreelancingModule } from '../../../../src/app/modules/freelancing/module';
import { ProjectStore } from '../../../../src/app/modules/freelancing/stores/project';
import { AccountStore } from '../../../../src/app/modules/freelancing/stores/account';
import { PrefixedStateReadWriter } from '../../../../node_modules/lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { projectData, projectDid, projectId } from './constants/project';
import { employerAccount, employerDid } from './constants/account';
import { chainID, moduleConfig } from './constants/config';
import { didMethodMock } from './constants/mocks';

describe('FreelancingEndpoint', () => {
	let context: ModuleEndpointContext;
	let module: FreelancingModule;
	let endpoint: FreelancingEndpoint;
	let stateStore: PrefixedStateReadWriter;
	let projectSubstore: ProjectStore;
	let accountSubstore: AccountStore;

	afterEach(jest.clearAllMocks);

	beforeEach(async () => {
		module = new FreelancingModule();
		endpoint = module.endpoint;
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		projectSubstore = module.stores.get(ProjectStore);
		accountSubstore = module.stores.get(AccountStore);
		context = testing.createTransientMethodContext({ stateStore }) as any;
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
		await accountSubstore.set(context as any, accountSubstore.getKey(employerDid), employerAccount);

		endpoint.addDependencies(didMethodMock as any);
		endpoint.init(moduleConfig.genesisConfig as any);
	});

	it('should inherit from BaseEndpoint', () => {
		expect(FreelancingEndpoint.prototype).toBeInstanceOf(BaseEndpoint);
	});

	describe('constructor', () => {
		it('should be of the correct type', () => {
			expect(endpoint).toBeInstanceOf(FreelancingEndpoint);
		});

		it("should expose 'init'", () => {
			expect(typeof endpoint.init).toBe('function');
		});

		it("should expose 'addDependencies'", () => {
			expect(typeof endpoint.addDependencies).toBe('function');
		});

		it("should expose 'getAccount'", () => {
			expect(typeof endpoint.getAccount).toBe('function');
		});

		it("should expose 'getProject'", () => {
			expect(typeof endpoint.getProject).toBe('function');
		});

		it("should expose 'getProjectList'", () => {
			expect(typeof endpoint.getProjectList).toBe('function');
		});
	});

	describe('init', () => {
		it('should set the config accordingly', () => {
			endpoint.init(moduleConfig as any);
			expect(endpoint['_config']).toStrictEqual(moduleConfig);
		});
	});

	describe('addDependencies', () => {
		it('should add did method to dependencies', () => {
			const mock = jest.fn();
			endpoint.addDependencies(mock as any);
			expect(endpoint['_didMethod']).toBe(mock);
		});
	});

	describe('getAccount', () => {
		it('should get specified account', async () => {
			const param = { did: employerDid };
			context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
			const account = await endpoint.getAccount(context);
			expect(account).toStrictEqual(employerAccount);
		});

		it('should throw an error if param.did is not a string', async () => {
			const func = async () => {
				const param = { did: 1 };
				context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
				await endpoint.getAccount(context);
			};
			await expect(func()).rejects.toThrow();
		});
	});

	describe('getProject', () => {
		it('should get specified project', async () => {
			const param = { project: projectDid };
			context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
			const project = await endpoint.getProject(context);
			expect(project).toStrictEqual(projectData);
		});

		it('should throw an error if param.project is not a string', async () => {
			const func = async () => {
				const param = { project: 1 };
				context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
				await endpoint.getProject(context);
			};
			await expect(func()).rejects.toThrow();
		});
	});

	describe('getProjectList', () => {
		it('should get all project list', async () => {
			context = testing.createTransientModuleEndpointContext({ stateStore, params: undefined });
			const projectList = await endpoint.getProjectList(context);
			expect(projectList.projects).toHaveLength(3);
		});

		it('should throw an error if param.limit is not a number', async () => {
			const func = async () => {
				const param = { limit: 'notnumber' };
				context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
				await endpoint.getProjectList(context);
			};
			await expect(func()).rejects.toThrow();
		});

		it('should throw an error if param.offset is not a number', async () => {
			const func = async () => {
				const param = { offset: 'notnumber' };
				context = testing.createTransientModuleEndpointContext({ stateStore, params: param });
				await endpoint.getProjectList(context);
			};
			await expect(func()).rejects.toThrow();
		});
	});
});
