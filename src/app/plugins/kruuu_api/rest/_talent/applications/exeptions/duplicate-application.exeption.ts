import { Exeption } from '~api/shared';

export class DuplicateApplicationExeption extends Exeption {
	protected key = 'duplicateApplication';
	constructor() {
		super('Duplicate application');
	}
}
