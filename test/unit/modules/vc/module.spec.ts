import { BaseModule } from 'lisk-sdk';
import { VcModule } from '../../../../src/app/modules/vc/module';

describe('VcModule', () => {
	let vcModule: VcModule;

	beforeEach(() => {
		vcModule = new VcModule();
	});

	it('should inherit from BaseModule', () => {
		expect(VcModule.prototype).toBeInstanceOf(BaseModule);
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(vcModule.name).toBe('vc');
		});
	});

	describe('metadata', () => {
		it('should return module metadata', () => {
			const moduleMetadata = vcModule.metadata();
			expect(typeof moduleMetadata).toBe('object');
			expect(Object.keys(moduleMetadata)).toEqual([
				'commands',
				'events',
				'stores',
				'endpoints',
				'assets',
			]);
			expect(moduleMetadata.commands).toHaveLength(1);
			expect(moduleMetadata.endpoints).toHaveLength(0);
			expect(moduleMetadata.events).toHaveLength(1);
			expect(moduleMetadata.assets).toHaveLength(0);
			expect(moduleMetadata.stores).toHaveLength(1);
		});
	});
});
