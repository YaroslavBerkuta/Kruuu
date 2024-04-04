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
import { ProjectStore, ProjectStoreData, Properties, Updates } from '../stores/project';
import { createProjectSchema } from '../schema/commands/create_project_command';
import { AccountStore } from '../stores/account';
import { FreelancingMethod } from '../method';
import { CREATE_PROJECT_UPDATES } from '../constants/events';
import { NewUpdatesEvent } from '../events/new_updates';
import {
	PROPERTIES_KEY_MAX_LENGTH,
	PROPERTIES_VALUE_MAX_LENGTH,
	SIGNATURE_BYTES_LENGTH,
} from '../constants/validation';
import { getProjectDid } from '../utils/did';

export interface CreateProjectParams {
	properties: Properties[];
	employer: string;
	signature: Buffer;
}

export class CreateProjectCommand extends BaseCommand {
	public schema = createProjectSchema;

	private _didMethod: DidMethod | undefined;
	private _freelancingMethod: FreelancingMethod | undefined;

	public addDependencies(didMethod: DidMethod, freelancingMethod: FreelancingMethod) {
		this._didMethod = didMethod;
		this._freelancingMethod = freelancingMethod;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		_context: CommandVerifyContext<CreateProjectParams>,
	): Promise<VerificationResult> {
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
		if (_context.params.properties.length > 0) {
			for (const props of _context.params.properties) {
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

	public async execute(_context: CommandExecuteContext<CreateProjectParams>): Promise<void> {
		const { senderPublicKey } = _context.transaction;
		const accountSubstore = this.stores.get(AccountStore);
		const projectSubstore = this.stores.get(ProjectStore);

		const didConfig = await this._didMethod.getConfig();
		let employer = did.getAddressDIDFromPublicKey(didConfig.chainspace, senderPublicKey);

		if (_context.params.employer) {
			const senderRelationshipWithEmployer = await this._didMethod.authorize(
				_context,
				_context.params.employer,
				{ publicKey: senderPublicKey, relationship: ['authentication'] },
			);

			if (senderRelationshipWithEmployer.length === 0) {
				const nonce = await this._didMethod.getNonce(_context, _context.params.employer);
				const payload = utils.objects.cloneDeep(_context.params);
				delete payload.signature;
				payload.nonce = nonce.nonce;

				const challenge = did.utils.object.encodeJSON(payload).toString('hex');
				const signature = _context.params.signature;

				const signerRelationshipWithEmployer = await this._didMethod.authorize(
					_context,
					_context.params.employer,
					{ challenge, signature, relationship: ['authentication'] },
				);

				if (signerRelationshipWithEmployer.length === 0) {
					throw new Error('employer DID authorization failed');
				}

				this._didMethod.incrementNonce(_context, _context.params.employer);
			}
			employer = _context.params.employer;
		}

		const projectId = await this._freelancingMethod.getNextAvailableIndex(_context);
		const projectKey = projectSubstore.getKey(_context.chainID, projectId);
		const projectDid = getProjectDid(didConfig.chainspace, projectKey);

		const update: Updates = {
			author: employer,
			type: CREATE_PROJECT_UPDATES,
			transaction: _context.transaction.id,
			properties: [
				{
					key: 'did',
					value: projectDid,
				},
			],
		};

		const project: ProjectStoreData = {
			did: projectDid,
			employer,
			properties: utils.objects.cloneDeep(_context.params.properties),
			talents: [],
			updates: [update],
		};

		await projectSubstore.set(_context, projectKey, project);
		this._didMethod.create(_context, senderPublicKey, projectDid, [employer], []);

		const accountKey = accountSubstore.getKey(employer);
		const account = await accountSubstore.getOrDefault(_context, accountKey);
		account.employerOf.unshift(projectDid);
		await accountSubstore.set(_context, accountKey, account);

		const newUpdatesEvent = this.events.get(NewUpdatesEvent);
		newUpdatesEvent.add(_context, {
			updates: [update],
		});
	}
}
