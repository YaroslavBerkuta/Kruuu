/* eslint-disable class-methods-use-this */

import { DidMethod, did } from 'lisk-did';
import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	utils,
} from 'lisk-sdk';
import { ProjectStore, Properties, Updates } from '../stores/project';
import { addUpdatesSchema } from '../schema/commands/add_updates_command';
import {
	PROPERTIES_KEY_MAX_LENGTH,
	PROPERTIES_VALUE_MAX_LENGTH,
	SIGNATURE_BYTES_LENGTH,
} from '../constants/validation';
import { getProjectIdentity } from '../utils/did';
import { NewUpdatesEvent } from '../events/new_updates';

export interface AddUpdatesParams {
	project: string;
	updates: {
		type: string;
		properties: Properties[];
	}[];
	author: string;
	signature: Buffer;
}

export class AddUpdatesCommand extends BaseCommand {
	public schema = addUpdatesSchema;

	private _didMethod: DidMethod | undefined;

	public addDependencies(didMethod: DidMethod) {
		this._didMethod = didMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		_context: CommandVerifyContext<AddUpdatesParams>,
	): Promise<VerificationResult> {
		try {
			did.parseDIDComponent(_context.params.author);
		} catch {
			return {
				status: VerifyStatus.FAIL,
				error: new Error(`author: ${_context.params.author}, is not a valid Lisk DID`),
			};
		}
		if (_context.params.updates.length === 0) {
			return {
				status: VerifyStatus.FAIL,
				error: new Error(`at least one update needed`),
			};
		}
		if (
			_context.params.signature.length > 0 &&
			_context.params.signature.length !== SIGNATURE_BYTES_LENGTH
		) {
			return {
				status: VerifyStatus.FAIL,
				error: new Error(
					`parameter signature should exactly ${SIGNATURE_BYTES_LENGTH} bytes, if provided`,
				),
			};
		}
		for (const update of _context.params.updates) {
			for (const props of update.properties) {
				if (props.key.length > PROPERTIES_KEY_MAX_LENGTH) {
					return {
						status: VerifyStatus.FAIL,
						error: new Error(
							`properties key length can't exceed ${PROPERTIES_KEY_MAX_LENGTH} character`,
						),
					};
				}
				if (props.value.length > PROPERTIES_VALUE_MAX_LENGTH) {
					return {
						status: VerifyStatus.FAIL,
						error: new Error(
							`properties value length can't exceed ${PROPERTIES_VALUE_MAX_LENGTH} character`,
						),
					};
				}
			}
		}
		return { status: VerifyStatus.OK };
	}

	public async execute(_context: CommandExecuteContext<AddUpdatesParams>): Promise<void> {
		const { senderPublicKey } = _context.transaction;
		const projectSubstore = this.stores.get(ProjectStore);

		const didConfig = await this._didMethod.getConfig();

		const { projectKey, projectDid } = getProjectIdentity(
			didConfig.chainspace,
			_context.params.project,
		);

		const project = await projectSubstore.getOrUndefined(_context, projectKey);
		if (!project) throw new Error('project doesnt exists');

		const nonce = await this._didMethod.getNonce(_context, _context.params.author);
		const payload = utils.objects.cloneDeep(_context.params);
		delete payload.signature;
		payload.nonce = nonce.nonce;

		const challenge = did.utils.object.encodeJSON(payload).toString('hex');
		const signature = _context.params.signature;
		const publicKey = senderPublicKey;
		let nonceIncremented = false;

		const senderRelationshipWithAuthor = await this._didMethod.authorize(
			_context,
			_context.params.author,
			{ publicKey, relationship: ['authentication'] },
		);

		if (senderRelationshipWithAuthor.length === 0) {
			const signerRelationshipWithAuthor = await this._didMethod.authorize(
				_context,
				_context.params.author,
				{ challenge, signature, relationship: ['authentication'] },
			);

			if (signerRelationshipWithAuthor.length === 0) {
				throw new Error('author DID authorization failed');
			}

			if (!nonceIncremented) {
				this._didMethod.incrementNonce(_context, _context.params.author);
				nonceIncremented = true;
			}
		}

		const senderRelationshipWithProject = await this._didMethod.authorize(_context, projectDid, {
			publicKey,
			relationship: ['authentication'],
		});

		if (senderRelationshipWithProject.length === 0) {
			const signerRelationshipWithProject = await this._didMethod.authorize(_context, projectDid, {
				challenge,
				signature,
				relationship: ['authentication'],
			});

			if (signerRelationshipWithProject.length === 0) {
				throw new Error('project DID authorization failed');
			}

			if (!nonceIncremented) {
				this._didMethod.incrementNonce(_context, _context.params.author);
				nonceIncremented = true;
			}
		}

		const updates: Updates[] = _context.params.updates.map(update => ({
			author: _context.params.author,
			type: update.type,
			transaction: _context.transaction.id,
			properties: utils.objects.cloneDeep(update.properties),
		}));

		project.updates = [...updates, ...project.updates];

		await projectSubstore.set(_context, projectKey, project);

		const updatesForEvent = updates.map(update => {
			return {
				...update,
				properties: [
					...update.properties,
					{
						key: 'did',
						value: projectDid,
					},
				],
			};
		});

		const newUpdatesEvent = this.events.get(NewUpdatesEvent);
		newUpdatesEvent.add(_context, { updates: updatesForEvent });
	}
}
