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
import {
	didMethodMock,
	mockedAuthorize,
	mockedGetNonce,
	mockedIncrementNonce,
} from '../constants/mocks';
import {
	employerDid,
	employerPublicKey,
	talent1Did,
	talent1PrivateKey,
} from '../constants/account';
import { chainID } from '../constants/config';
import {
	PROPERTIES_KEY_MAX_LENGTH,
	PROPERTIES_VALUE_MAX_LENGTH,
	SIGNATURE_BYTES_LENGTH,
} from '../../../../../src/app/modules/freelancing/constants/validation';
import { projectData, projectDid, projectId } from '../constants/project';
import { eventResult } from '../../../../utils/events';
import { NewUpdatesEvent } from '../../../../../src/app/modules/freelancing/events/new_updates';
import { createStoreGetter } from '../../../../utils/store';
import {
	AddUpdatesCommand,
	AddUpdatesParams,
} from '../../../../../src/app/modules/freelancing/commands/add_updates_command';
import { addUpdatesSchema } from '../../../../../src/app/modules/freelancing/schema/commands/add_updates_command';

type CommandParam = AddUpdatesParams;
const MODULE_NAME = 'freelancing';
const COMMAND_NAME = 'addUpdates';
const commandSchema = addUpdatesSchema;

let stateStore: PrefixedStateReadWriter;
const validParam: AddUpdatesParams = {
	project: projectDid,
	author: employerDid,
	updates: [
		{
			type: 'updateType',
			properties: [
				{
					key: 'key',
					value: 'value',
				},
			],
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

describe('AddUpdatesCommand', () => {
	let module: FreelancingModule;
	let command: AddUpdatesCommand;
	let projectSubstore: ProjectStore;

	beforeEach(async () => {
		module = new FreelancingModule();
		command = new AddUpdatesCommand(module.stores, module.events);
		stateStore = new PrefixedStateReadWriter(new testing.InMemoryPrefixedStateDB());
		projectSubstore = module.stores.get(ProjectStore);
		command.addDependencies(didMethodMock as any);
		await projectSubstore.set(
			createStoreGetter(stateStore),
			projectSubstore.getKey(chainID, projectId),
			projectData,
		);
	});

	describe('constructor', () => {
		it('should inherit from BaseCommand', () => {
			expect(AddUpdatesCommand.prototype).toBeInstanceOf(BaseCommand);
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

		it('should throw error when user sends transaction with invalid author format', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				author: 'not a did format',
			});
			await expect(command.verify(context)).resolves.toHaveProperty('status', VerifyStatus.FAIL);
		});

		it('should throw error when user sends transaction with zero update', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				updates: [],
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

		it('should throw error when user sends transaction with properties key exceeding limit', async () => {
			const context = createCommandVerifyContext({
				...validParam,
				updates: [
					{
						type: 'update',
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
				updates: [
					{
						type: 'update',
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
		it('should add updates to specified project', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);

			const project = await projectSubstore.get(
				context,
				projectSubstore.getKey(chainID, projectId),
			);
			expect(project.updates[0].type).toBe(validParam.updates[0].type);
		});

		it('should throw an error if author did authentication failed', async () => {
			const func = async () => {
				const context = createCommandExecuteContext({
					...validParam,
					author: talent1Did,
					signature: Buffer.alloc(SIGNATURE_BYTES_LENGTH),
				});
				await command.execute(context);
			};
			await expect(func()).rejects.toThrow();
		});

		it('should create a new project if specified with custom author other than sender', async () => {
			const param = {
				...validParam,
				author: talent1Did,
			};
			const context = createCommandExecuteContext({
				...param,
				signature: createSignature(param, talent1PrivateKey),
			});
			await command.execute(context);

			const project = await projectSubstore.get(
				context,
				projectSubstore.getKey(chainID, projectId),
			);
			expect(project.updates[0].type).toBe(validParam.updates[0].type);

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

		it('should invoke authorize method from did', async () => {
			const context = createCommandExecuteContext(validParam);
			await command.execute(context);
			expect(mockedAuthorize).toHaveBeenCalled();
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
					updates: [
						{
							...project.updates[0],
							properties: [
								...project.updates[0].properties,
								{ key: 'did', value: 'did:lisk:kruuu:project:000000000000000000000000' },
							],
						},
					],
				}),
			).toBe(true);
		});
	});
});
