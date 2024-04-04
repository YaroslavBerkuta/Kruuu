import { Exeption } from '~api/shared';

export class WalletNotExistExeption extends Exeption {
	protected key = 'wallet-not-exist';

	constructor() {
		super('Wallet not exist');
	}
}
