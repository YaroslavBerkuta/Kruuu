import { Currency } from '~api/domain/wallets/typing'
import { CheckoutType } from '../enums'

export interface IStripeService {
	createProduct(payload: ICreateStripeProductPayload): Promise<void>
	createCheckout(userId: number, payload: ICreateCheckoutPayload): Promise<{ url: string }>
	listenWebhook(payload: Buffer, header: string): Promise<any>
	createInvoice(payload: ICreateInvoicePayload): Promise<string>
}

export interface ICreateStripeProductPayload {
	name: string
	currency: 'USD' | 'UAH'
	price: number
}

export interface ICreateCheckoutPayload {
	checkoutType: CheckoutType
	objectId: number
}

export interface ICreateInvoicePayload {
	userId: number
	currency: Currency
	amount: number
	checkoutType: CheckoutType
}
