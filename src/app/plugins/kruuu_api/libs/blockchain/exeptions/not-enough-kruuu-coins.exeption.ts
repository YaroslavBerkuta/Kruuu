import { Exeption } from '~api/shared';

export class NotEnoughKruuuCoinsExeption extends Exeption {
	protected key: string = 'notEnoughKruuuCoins';

	constructor() {
		super('Not enough kruuu coins to make transaction');
	}
}
