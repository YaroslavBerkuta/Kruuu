/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BaseModule } from 'lisk-sdk';
import { FreelancingEndpoint } from '../../../../src/app/modules/freelancing/endpoint';
import { FreelancingMethod } from '../../../../src/app/modules/freelancing/method';
import { FreelancingModule } from '../../../../src/app/modules/freelancing/module';
import { moduleConfig } from './constants/config';

describe('FreelancingModule', () => {
	let freelancingModule: FreelancingModule;

	beforeEach(() => {
		freelancingModule = new FreelancingModule();
	});

	it('should inherit from BaseModule', () => {
		expect(FreelancingModule.prototype).toBeInstanceOf(BaseModule);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(freelancingModule.name).toBe('freelancing');
		});

		it('should expose endpoint', () => {
			expect(freelancingModule).toHaveProperty('endpoint');
			expect(freelancingModule.endpoint).toBeInstanceOf(FreelancingEndpoint);
		});

		it('should expose Method', () => {
			expect(freelancingModule).toHaveProperty('method');
			expect(freelancingModule.method).toBeInstanceOf(FreelancingMethod);
		});
	});

	describe('metadata', () => {
		it('should return module metadata', () => {
			const moduleMetadata = freelancingModule.metadata();
			expect(typeof moduleMetadata).toBe('object');
			expect(Object.keys(moduleMetadata)).toEqual([
				'commands',
				'events',
				'stores',
				'endpoints',
				'assets',
			]);
			expect(moduleMetadata.commands).toHaveLength(3);
			expect(moduleMetadata.endpoints).toHaveLength(3);
			expect(moduleMetadata.events).toHaveLength(1);
			expect(moduleMetadata.assets).toHaveLength(0);
			expect(moduleMetadata.stores).toHaveLength(2);
		});
	});

	describe('init', () => {
		it('should initialize module method', async () => {
			const mock = jest.fn();
			jest.spyOn(freelancingModule['method'], 'init').mockImplementation(mock);
			await freelancingModule.init(moduleConfig as any);
			expect(mock).toHaveBeenCalled();
		});

		it('should initialize module endpoint', async () => {
			const mock = jest.fn();
			jest.spyOn(freelancingModule['endpoint'], 'init').mockImplementation(mock);
			await freelancingModule.init(moduleConfig as any);
			expect(mock).toHaveBeenCalled();
		});
	});

	describe('addDependencies', () => {
		it('should add dependencies to createProject command', () => {
			const mock = jest.fn();
			jest
				.spyOn(freelancingModule['_createProjectCommand'], 'addDependencies')
				.mockImplementation(mock);
			freelancingModule.addDependencies(undefined as any);
			expect(mock).toHaveBeenCalled();
		});

		it('should add dependencies to addTalents command', () => {
			const mock = jest.fn();
			jest
				.spyOn(freelancingModule['_addTalentsCommand'], 'addDependencies')
				.mockImplementation(mock);
			freelancingModule.addDependencies(undefined as any);
			expect(mock).toHaveBeenCalled();
		});

		it('should add dependencies to addUpdates command', () => {
			const mock = jest.fn();
			jest
				.spyOn(freelancingModule['_addUpdatesCommand'], 'addDependencies')
				.mockImplementation(mock);
			freelancingModule.addDependencies(undefined as any);
			expect(mock).toHaveBeenCalled();
		});

		it('should add dependencies to module endpoint', () => {
			const mock = jest.fn();
			jest.spyOn(freelancingModule['endpoint'], 'addDependencies').mockImplementation(mock);
			freelancingModule.addDependencies(undefined as any);
			expect(mock).toHaveBeenCalled();
		});
	});
});
