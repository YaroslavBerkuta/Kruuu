import { Exeption } from '~api/shared';

export class WalletBallanceErrorExeption extends Exeption {
	protected key = 'wallet-ballance-not-exist';

	constructor() {
		super('The wallet balance is too low');
	}
}
