import { Inject, Injectable } from '@nestjs/common';
import { Seeder, getEnv } from '~api/shared';
import { IStripeService, STRIPE_SERVICE } from '../typing';

@Injectable()
export class StripeSeed extends Seeder {
	@Inject(STRIPE_SERVICE) private readonly stripeService: IStripeService;

	protected name = 'Stripe seeder';

	protected async seed(): Promise<void> {
		return await this.stripeService.createProduct({
			name: getEnv('STRIPE_PRODUCT_NAME'),
			price: 1,
			currency: 'USD',
		});
	}
}
