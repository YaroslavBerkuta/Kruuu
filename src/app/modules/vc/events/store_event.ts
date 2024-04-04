import { BaseEvent } from 'lisk-sdk';

export type VCStoreEventData = {
	id: string;
	docBytes: Buffer;
};

export class VCStoreEvent extends BaseEvent<VCStoreEventData> {
	public schema = vcStoreEventSchema;
}

export const vcStoreEventSchema = {
	$id: '/vc/events/store',
	type: 'object',
	required: ['id', 'docBytes'],
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
