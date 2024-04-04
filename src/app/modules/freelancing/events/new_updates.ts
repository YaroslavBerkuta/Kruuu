import { BaseEvent } from 'lisk-sdk';
import { Updates } from '../stores/project';
import { newUpdatesEventSchema } from '../schema/events/new_updates';

export interface NewUpdatesEventData {
	updates: Updates[];
}

export class NewUpdatesEvent extends BaseEvent<NewUpdatesEventData> {
	public schema = newUpdatesEventSchema;
}
