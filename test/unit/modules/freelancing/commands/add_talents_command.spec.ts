/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
	BaseCommand,
	Transaction,
	VerifyStatus,
	codec,
	cryptography,
	testing,
	utils,
} from 'lisk-sdk';
import { did } from 'lisk-did';
import { FreelancingModule } from '../../../../../src/app/modules/freelancing/module';
import { PrefixedStateReadWriter } from '../../../../../node_modules/lisk-framework/dist-node/state_machine/prefixed_state_read_writer';
import { ProjectStore } from '../../../../../src/app/modules/freelancing/stores/project';
import { AccountStore } from '../../../../../src/app/modules/freelancing/stores/account';
import {
	didMethodMock,
	mockedAddKeys,
	mockedAuthorize,
	mockedGetNonce,
	mockedIncrementNonce,
} from '../constants/mocks';
import { employerPublicKey, talent1Did, talent1PrivateKey } from '../constants/account';
import { chainID } from '../constants/config';
import {
	PROPERTIES_KEY_MAX_LENGTH,
	PROPERTIES_VALUE_MAX_LENGTH,
	SIGNATURE_BYTES_LENGTH,
} from '../../../../../src/app/modules/freelancing/constants/validation';
import { projectData, projectDid, projectId } from '../constants/project';
import { eventResult } from '../../../../utils/events';
import { NewUpdatesEvent } from '../../../../../src/app/modules/freelancing/events/new_updates';
import {
	AddTalentsCommand,
	AddTalentsParams,
} from '../../../../../src/app/modules/freelancing/commands/add_talents_command';
import { addTalentsSchema } from '../../../../../src/app/modules/freelancing/schema/commands/add_talents_command';
import { createStoreGetter } from '../../../../utils/store';

type CommandParam = AddTalentsParams;
const MODULE_NAME = 'freelancing';
const COMMAND_NAME = 'addTalents';
const commandSchema = addTalentsSchema;

let stateStore: PrefixedStateReadWriter;
const validParam: AddTalentsParams = {
	project: projectDid,
	talents: [
		{
			subject: talent1Did,
			properties: [{ key: 'key', value: 'value' }],
		},
	],
	signature: Buffer.alloc(0),
};

function createCommandContext(param: CommandParam) {
	const encodedTransactionParams = codec.encode(commandSchema, param);
	const transaction = new Transaction({
		module: MODULE_NAME,
		command: COMMAND_NAME,
		senderPublicKey: employerPublicKey,
		nonce: BigInt(0),
		fee: BigInt(1000000000),
		params: encodedTransactionParams,
		signatures: [employerPublicKey],
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

function createSignature(param: CommandParam, privateKey: Buffer): Buffer {
	const payload = utils.objects.cloneDeep(param);
	delete payload.signature;
	payload.nonce = '0';
	const challenge = did.utils.object.encodeJSON(payload).toString('hex');
	return cryptography.ed.signMessageWithPrivateKey(challenge, privateKey).signature;
}

describe('AddTalentsCommand', () => {
	let module: FreelancingModule;
	let command: AddTalentsCommand;
	let projectSubstore: ProjectStore;
	let accountSubstore: AccountStore;

	beforeEach(async () => {
		module = new FreelancingModule();
		command = new AddTalentsCommand(module.stores, module.events);
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		projectSubstore = module.stores.get(ProjectStore);
		accountSubstore = module.stores.get(AccountStore);
		command.addDependencies(didMethodMock as any);
		await projectSubstore.set(
			createStoreGetter(stateStore),
			projectSubstore.getKey(chainID, projectId),
			projectData,
		);
	});

	describe('constructor', () => {
		it('should inherit from BaseCommand', () => {
			expect(AddTalentsCommand.prototype).toBeInstanceOf(BaseCommand);
		});

		it('should have valid name', () => {
			expect(command.name).toBe(COMMAND_NAME);
		});

		it('should have valid schema', () => {
			expect(command.schema).toEqual(commandSchema);
		});
	});

	describe('addDependencies', () => {
		it('should add did method as dependencies', () => {
			expect(command['_didMethod']).toStrictEqual(didMethodMock);
		});
	});

	describe('verify', () => {
		it('should return status OK when called with valid input', async () => {
			const context = createCommandVerifyContext(validParam);
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.OK);
		});

		it('should throw error when user sends transaction with zero talents', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				talents: [],
			});
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.FAIL);
		});

		it('should throw error when user sends transaction with invalid signature', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				signature: Buffer.from(`invalid`, 'utf-8'),
			});
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.FAIL);
		});

		it('should throw error when user sends transaction with invlaid talent subject format', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				talents: [{ subject: 'invalid', properties: [] }],
			});
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.FAIL);
		});

		it('should throw error when user sends transaction with properties key exceeding limit', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				talents: [
					{
						subject: talent1Did,
						properties: [
							{
								key: 'a'.repeat(PROPERTIES_KEY_MAX_LENGTH + 1),
								value: 'valid',
							},
						],
					},
				],
			});
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.FAIL);
		});

		it('should throw error when user sends transaction with properties value exceeding limit', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				talents: [
					{
						subject: talent1Did,
						properties: [
							{
								key: 'key',
								value: 'a'.repeat(PROPERTIES_VALUE_MAX_LENGTH + 1),
							},
						],
					},
				],
			});
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.FAIL);
		});
	});

	describe('execute', () => {
		it('should add talents to specified project', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);

			const project = await projectSubstore.get(
				context,
				projectSubstore.getKey(chainID, projectId),
			);
			expect(project.talents).toStrictEqual(validParam.talents);
		});

		it('should create a new project if specified with custom employer other than sender', async () => {
			const context = createCommandExecuteContext({
				...validParam,
				signature: createSignature(validParam, talent1PrivateKey),
			});
			await command.execute(context);

			const project = await projectSubstore.get(
				context,
				projectSubstore.getKey(chainID, projectId),
			);
			expect(project.talents).toStrictEqual(validParam.talents);

			expect(mockedIncrementNonce).toHaveBeenCalled();
			expect(mockedGetNonce).toHaveBeenCalled();
		});

		it('should throw an error if project doesnt exists', async () => {
			const func = async () => {
				const context = createCommandExecuteContext({
					...validParam,
					project: 'notexist',
				});
				await command.execute(context);
			};
			await expect(func()).rejects.toThrow();
		});

		it('should throw an error if employer did authentication failed', async () => {
			const func = async () => {
				const context = createCommandExecuteContext({
					...validParam,
					signature: Buffer.alloc(SIGNATURE_BYTES_LENGTH),
				});
				await command.execute(context);
			};
			await expect(func()).rejects.toThrow();
		});

		it('should add project to talent account', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);

			const account = await accountSubstore.get(context, accountSubstore.getKey(talent1Did));
			expect(account.talentOf).toContain(projectDid);
		});

		it('should invoke authorize method from did', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);
			expect(mockedAuthorize).toHaveBeenCalled();
		});

		it('should invoke addKeys method from did', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);
			expect(mockedAddKeys).toHaveBeenCalled();
		});

		it('should add command events', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);

			const project = await projectSubstore.get(
				context,
				projectSubstore.getKey(chainID, projectId),
			);
			expect(
				eventResult(context.eventQueue, NewUpdatesEvent, MODULE_NAME, {
					updates: [project.updates[0]],
				}),
			).toBe(true);
		});
	});
});
