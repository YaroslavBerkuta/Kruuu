import { Controller, Headers, Inject, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IStripeService, RequestWithRawBody, STRIPE_SERVICE } from '~api/domain/stripe/typing';

@Controller('stripe')
export class StripeController {
	@Inject(STRIPE_SERVICE) private readonly stripeService: IStripeService;

	@ApiTags('Stripe | Webhook')
	@Post('webhook')
	public webhook(
		@Headers('stripe-signature') signature: string,
		@Req() request: RequestWithRawBody,
	) {
		return this.stripeService.listenWebhook(request.rawBody, signature);
	}
}
