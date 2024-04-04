import { ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import {
	CheckoutType,
	ICreateCheckoutPayload,
	ICreateInvoicePayload,
	ICreateStripeProductPayload,
	IStripeOptions,
	IStripeService,
	STRIPE_OPTIONS,
} from '../typing';
import { isEmpty } from 'lodash';

import { EventEmitter2 } from '@nestjs/event-emitter';
import _ from 'lodash';
import {
	IPaymentRepository,
	IPaymentService,
	PAYMENT_REPOSITORY,
	PAYMENT_SERVICE,
	PaymentStatus,
} from '~api/domain/payment/typing';
import { IUsersRepository, USERS_REPOSITORY } from '~api/domain/users/typing';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { Currency, PaymentCurrency } from '~api/domain/wallets/typing';
import { Events } from '~api/shared';

@Injectable()
export class StripeService implements IStripeService {
	@Inject(PAYMENT_SERVICE) private readonly paymentService: IPaymentService;
	@Inject(USERS_REPOSITORY) private readonly userRepository: IUsersRepository;
	@Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: IPaymentRepository;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;
	private client: Stripe;
	private option: IStripeOptions;

	constructor(@Inject(STRIPE_OPTIONS) option: IStripeOptions, private eventEmitter: EventEmitter2) {
		this.client = new Stripe(option.apiKey, option.config);
		this.option = option;
	}

	public async findCustomer(userId: number) {
		const user = await this.userRepository.findOne({ where: { id: userId } });

		const exist = await this.client.customers.search({
			query: `email:\'${user.email}\'`,
			limit: 1,
		});

		if (!isEmpty(exist.data)) {
			return exist.data[0];
		}
		const customer = await this.client.customers.create({
			email: user.email,
			name: user.name,
		});

		return customer;
	}

	public async createProduct(payload: ICreateStripeProductPayload) {
		const { data } = await this.client.products.search({
			query: `active:\'true\' AND name:\'${payload.name}\'`,
		});

		if (!isEmpty(data)) throw new ConflictException('this product already exist');

		const product = await this.client.products.create({
			name: payload.name,
			active: true,
		});

		await this.client.prices.create({
			product: product.id,
			currency: payload.currency,
			unit_amount: payload.price * 100,
			active: true,
		});
	}

	public async createInvoice(payload: ICreateInvoicePayload) {
		if (payload.currency == Currency.IDR && payload.amount < 15000) {
			throw new ForbiddenException(
				'But the minimum amount for top-up is 15,000 Rp. Please, increase the amount and try again',
			);
		}

		const customer = await this.findCustomer(payload.userId);
		const invoice = await this.client.invoices.create({
			currency: PaymentCurrency[payload.currency],
			customer: customer.id,
			metadata: {
				checkoutType: payload.checkoutType,
			},
			expand: [
				'default_tax_rates',
				'default_payment_method',
				'default_source',
				'from_invoice.invoice',
			],
		});
		await this.client.invoiceItems.create({
			currency: PaymentCurrency[payload.currency],
			customer: customer.id,
			quantity: 1,
			unit_amount_decimal: String(payload.amount * 100),
			description: 'Wallet transaction',
			invoice: invoice.id,
			expand: ['price', 'price.product', 'tax_amounts.tax_rate', 'price.currency_options'],
		});

		await this.paymentService.create({
			userId: payload.userId,
			paymentMethod: 'stripe',
			paymentId: invoice.id,
			date: JSON.stringify(invoice),
		});

		const { hosted_invoice_url } = await this.client.invoices.finalizeInvoice(invoice.id);

		return hosted_invoice_url;
	}

	public async createCheckout(userId: number, payload: ICreateCheckoutPayload) {
		const { data } = await this.client.products.search({
			query: `active:\'true\' AND name:\'${this.option.product_name}\'`,
		});

		const price = await this.client.prices.search({
			query: `active:\'true\' AND product:\'${data[0].id}\'`,
		});

		const session = await this.client.checkout.sessions.create({
			success_url: this.option.success_url,
			line_items: [{ price: price.data[0].id, quantity: 1 }],
			mode: 'payment',
			metadata: {
				checkoutType: payload.checkoutType,
				objectId: payload.objectId,
			},
		});

		await this.paymentService.create({
			userId,
			paymentMethod: 'stripe',
			paymentId: session.id,
			date: JSON.stringify(session),
		});

		return { url: session.url };
	}

	public async listenWebhook(payload: Buffer, header: string) {
		const event = (await this.client.webhooks.constructEvent(
			payload,
			header,
			this.option.webhookKey,
		)) as any;
		if (event.type === 'checkout.session.completed') {
			if (event.data.object.metadata.checkoutType == CheckoutType.acceptApplication) {
				await this.eventEmitter.emit(Events.AcceptApplication, {
					applicationId: event.data.object.metadata.objectId,
				});
			}
			const payment = await this.paymentRepository.findOne({
				where: { paymentId: event.data.object.id },
			});

			if (!payment) return;

			await this.paymentRepository.update(payment.id, {
				status: PaymentStatus.CompletePayment,
			});

			this.wsService.emitToUser(payment.userId, 'close/browser');
		} else if (event.type === 'invoice.payment_succeeded') {
			const payment = await this.paymentRepository.findOne({
				where: { paymentId: event.data.object.id },
			});

			if (event.data.object.metadata.checkoutType == CheckoutType.walletReplenishment) {
				await this.eventEmitter.emit(Events.IncreaseWalletBalance, {
					userId: payment.userId,
					value: event.data.object?.total / 100,
					currency: event.data.object?.currency,
				});
			}

			if (!payment) return;

			await this.paymentRepository.update(payment.id, {
				status: PaymentStatus.CompletePayment,
			});

			this.wsService.emitToUser(payment.userId, 'close/browser');
		}
		return;
	}
}
