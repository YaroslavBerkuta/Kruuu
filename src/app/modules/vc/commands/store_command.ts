/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
} from 'lisk-sdk';
import { VCStateStore, vcStoreKey } from '../stores/vcStore';
import { VCStoreEvent } from '../events/store_event';

export interface StoreVCCommandParams {
	id: string;
	docBytes: Buffer;
}

export class StoreCommand extends BaseCommand {
	public schema = {
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

	// eslint-disable-next-line @typescript-eslint/require-await
	public async verify(
		_context: CommandVerifyContext<StoreVCCommandParams>,
	): Promise<VerificationResult> {
		if (_context.params.id.length < 1) {
			return {
				status: VerifyStatus.FAIL,
				error: new Error(`params.id length should be minimum 1 character`),
			};
		}
		return { status: VerifyStatus.OK };
	}

	public async execute(_context: CommandExecuteContext<StoreVCCommandParams>): Promise<void> {
		const vcStore = this.stores.get(VCStateStore);

		if (await vcStore.has(_context, vcStoreKey(_context.params.id))) {
			throw new Error('VC document with provided id already exist');
		}

		await vcStore.set(_context, vcStoreKey(_context.params.id), {
			docBytes: _context.params.docBytes,
		});

		const vcStoreEvent = this.events.get(VCStoreEvent);
		vcStoreEvent.add(_context, {
			id: _context.params.id,
			docBytes: _context.params.docBytes,
		});
	}
}
