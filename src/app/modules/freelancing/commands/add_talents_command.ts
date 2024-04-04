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
import { addTalentsSchema } from '../schema/commands/add_talents_command';
import {
	PROPERTIES_KEY_MAX_LENGTH,
	PROPERTIES_VALUE_MAX_LENGTH,
	SIGNATURE_BYTES_LENGTH,
} from '../constants/validation';
import { AccountStore } from '../stores/account';
import { getProjectIdentity } from '../utils/did';
import { ADD_TALENTS_UPDATES } from '../constants/events';
import { NewUpdatesEvent } from '../events/new_updates';

export interface AddTalentsParams {
	project: string;
	talents: {
		subject: string;
		properties: Properties[];
	}[];
	signature: Buffer;
}

export class AddTalentsCommand extends BaseCommand {
	public schema = addTalentsSchema;

	private _didMethod: DidMethod | undefined;

	public addDependencies(didMethod: DidMethod) {
		this._didMethod = didMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		_context: CommandVerifyContext<AddTalentsParams>,
	): Promise<VerificationResult> {
		if (_context.params.talents.length === 0) {
			return {
				status: VerifyStatus.FAIL,
				error: new Error(`at least one talent needed`),
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
		for (const talent of _context.params.talents) {
			try {
				did.parseDIDComponent(talent.subject);
			} catch {
				return {
					status: VerifyStatus.FAIL,
					error: new Error(`talent: ${talent.subject}, is not a valid Lisk DID`),
				};
			}
			for (const props of talent.properties) {
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

	public async execute(_context: CommandExecuteContext<AddTalentsParams>): Promise<void> {
		const { senderPublicKey } = _context.transaction;
		const accountSubstore = this.stores.get(AccountStore);
		const projectSubstore = this.stores.get(ProjectStore);

		const didConfig = await this._didMethod.getConfig();

		const { projectKey, projectDid } = getProjectIdentity(
			didConfig.chainspace,
			_context.params.project,
		);

		const project = await projectSubstore.getOrUndefined(_context, projectKey);
		if (!project) throw new Error('project doesnt exists');

		const senderRelationshipWithProject = await this._didMethod.authorize(_context, projectDid, {
			publicKey: senderPublicKey,
			relationship: ['authentication'],
		});

		if (!senderRelationshipWithProject.map(t => t.type).includes('controller')) {
			const nonce = await this._didMethod.getNonce(_context, project.employer);
			const payload = utils.objects.cloneDeep(_context.params);
			delete payload.signature;
			payload.nonce = nonce.nonce;

			const challenge = did.utils.object.encodeJSON(payload).toString('hex');
			const signature = _context.params.signature;

			const signerRelationshipWithProject = await this._didMethod.authorize(_context, projectDid, {
				challenge,
				signature,
				relationship: ['authentication'],
			});

			if (!signerRelationshipWithProject.map(t => t.type).includes('controller')) {
				throw new Error('employer DID authorization failed');
			}

			this._didMethod.incrementNonce(_context, project.employer);
		}

		const update: Updates = {
			author: project.employer,
			type: ADD_TALENTS_UPDATES,
			transaction: _context.transaction.id,
			properties: [
				{
					key: 'talents',
					value: JSON.stringify(_context.params.talents.map(t => t.subject)),
				},
			],
		};

		project.talents = [..._context.params.talents, ...project.talents];
		project.updates.unshift(update);

		await projectSubstore.set(_context, projectKey, project);

		const employerDidDocument = await this._didMethod.read(_context, project.employer);
		const publicKey = did.cryptography.codec.decodePublicKey(
			employerDidDocument.authentication[0].split('#')[1],
		);

		for (const talent of _context.params.talents) {
			const accountKey = accountSubstore.getKey(talent.subject);
			const account = await accountSubstore.getOrDefault(_context, accountKey);
			account.talentOf.unshift(projectDid);
			await accountSubstore.set(_context, accountKey, account);

			const talentDid = await this._didMethod.read(_context, talent.subject);
			const keys = talentDid.authentication
				.map(t => talentDid.verificationMethod.find(v => v.id === t))
				.map(t => ({
					publicKey: did.cryptography.codec.decodePublicKey(t.publicKeyMultibase),
					relationship: ['authentication'] as did.VerificationRelationship[],
				}));
			await this._didMethod.addKeys(_context, publicKey, projectDid, keys, project.employer);
		}

		const newUpdatesEvent = this.events.get(NewUpdatesEvent);
		newUpdatesEvent.add(_context, {
			updates: [update],
		});
	}
}
