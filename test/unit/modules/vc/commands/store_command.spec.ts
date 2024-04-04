import { BaseCommand, Transaction, VerifyStatus, codec, testing } from 'lisk-sdk';
import { VcModule } from '../../../../../src/app/modules/vc/module';
import {
	StoreCommand,
	StoreVCCommandParams,
} from '../../../../../src/app/modules/vc/commands/store_command';
import { PrefixedStateReadWriter } from '../../../../../node_modules/lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { publicKey } from '../constants/account';
import { chainID } from '../constants/config';
import { VCStateStore, vcStoreKey } from '../../../../../src/app/modules/vc/stores/vcStore';
import { validParam } from '../constants/doc';

type CommandParam = StoreVCCommandParams;
const MODULE_NAME = 'vc';
const COMMAND_NAME = 'store';
const commandSchema = {
	$id: 'StoreCommand',
	type: 'object',
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		docBytes: {
			dataType: 'bytes',
			fieldNumber: 2,
		},
	},
};

let stateStore: PrefixedStateReadWriter;

function createCommandContext(param: CommandParam) {
	const encodedTransactionParams = codec.encode(commandSchema, param);
	const transaction = new Transaction({
		module: MODULE_NAME,
		command: COMMAND_NAME,
		senderPublicKey: publicKey,
		nonce: BigInt(0),
		fee: BigInt(1000000000),
		params: encodedTransactionParams,
		signatures: [publicKey],
	});
	return testing.createTransactionContext({ chainID, stateStore, transaction });
}

function createCommandVerifyContext(param: CommandParam) {
	const context = createCommandContext(param);
	return context.createCommandVerifyContext<CommandParam>(commandSchema);
}

function createCommandExecuteContext(param: CommandParam) {
	const context = createCommandContext(param);
	return context.createCommandExecuteContext<CommandParam>(commandSchema);
}

describe('StoreCommand', () => {
	let module: VcModule;
	let command: StoreCommand;
	let vcSubstore: VCStateStore;

	beforeEach(() => {
		module = new VcModule();
		command = new StoreCommand(module.stores, module.events);
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		vcSubstore = module.stores.get(VCStateStore);
	});

	describe('constructor', () => {
		it('should inherit from BaseCommand', () => {
			expect(StoreCommand.prototype).toBeInstanceOf(BaseCommand);
		});

		it('should have valid name', () => {
			expect(command.name).toBe(COMMAND_NAME);
		});

		it('should have valid schema', () => {
			expect(command.schema).toEqual(commandSchema);
		});
	});

	describe('verify', () => {
		it('should return status OK when called with valid input', async () => {
			const context = createCommandVerifyContext(validParam);
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.OK);
		});

		it('should throw error when user sends transaction with empty id', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				id: '',
			});
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.FAIL);
		});
	});

	describe('execute', () => {
		it('should add document bytes as specified id', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);

			const doc = await vcSubstore.get(context, vcStoreKey(validParam.id));
			expect(doc).toStrictEqual({ docBytes: validParam.docBytes });
		});

		it('should throw an error if document with specified id already exists', async () => {
			const func = async () => {
				const context = createCommandExecuteContext(validParam);
				await vcSubstore.set(context, vcStoreKey(validParam.id), { docBytes: validParam.docBytes });
				await command.execute(context);
			};
			await expect(func()).rejects.toThrow();
		});
	});
});
