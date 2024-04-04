import { Exeption } from '~api/shared';

export class AnyWalletsNotExistExeption extends Exeption {
	protected key = 'any-wallets-not-exist';

	constructor() {
		super('Any wallets not exist');
	}
}
