import Stripe from 'stripe';

export interface IStripeOptions {
	apiKey: string;
	config: Stripe.StripeConfig;
	webhookKey: string;
	success_url: string;
	product_name: string;
}
