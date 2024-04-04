import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
	DUITKU_OPTIONS,
	ICreateTransactionData,
	IDuitkuOptions,
	IDuitkuService,
	IGetPaymentMethodsParams,
	IGetPaymentMethodsResp,
	IPaymentMethodItem,
	ITransaction,
} from './typing';
import axios, { AxiosResponse } from 'axios';
import * as moment from 'moment';
import { createHash } from 'crypto';
import * as randomstring from 'randomstring';
import {
	IPaymentRepository,
	IPaymentService,
	PAYMENT_REPOSITORY,
	PAYMENT_SERVICE,
	PaymentStatus,
} from '../payment/typing';
import { REAL_TIME_SERVICE, WSService } from '../real-time/typing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '~api/shared';
import { PaymentCurrency } from '../wallets/typing';

const axiosInst = axios.create({
	headers: {
		'Content-Type': 'application/json',
		Type: 'application/json',
	},
	timeout: 6000,
});

@Injectable()
export class DuitkuService implements IDuitkuService {
	@Inject(PAYMENT_SERVICE) private readonly paymentService: IPaymentService;
	@Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: IPaymentRepository;
	@Inject(REAL_TIME_SERVICE) private wsService: WSService;

	private options: IDuitkuOptions;

	constructor(
		@Inject(DUITKU_OPTIONS) options: IDuitkuOptions,
		private eventEmitter: EventEmitter2,
	) {
		this.options = options;
	}

	// async onModuleInit() {
	// 	await this.checkTransaction('GyqUHzynOc')
	// 	await this.getPaymentMethods({ amount: 20000 })
	// }

	private getCreateTransactionUrl = () => {
		return `${this.options.merchantPrefixUrl}/webapi/api/merchant/v2/inquiry`;
	};

	private getFetchPaymentMethodUrl = () => {
		return `${this.options.merchantPrefixUrl}/webapi/api/merchant/paymentmethod/getpaymentmethod`;
	};

	private getTransactionStatusUrl = () => {
		return `${this.options.merchantPrefixUrl}/webapi/api/merchant/transactionStatus`;
	};

	private getCallbackUrl = () => {
		return `${this.options.callBackUrl}/duitku/callback?`;
	};

	private generateId(length = 16): string {
		return randomstring.generate({ length });
	}

	public async createTransaction(data: ICreateTransactionData): Promise<ITransaction> {
		const datetime = moment().format('yyyy-MM-DD HH:mm:ss');

		try {
			const id = this.generateId(10);
			const _data = {
				merchantcode: this.options.merchantCode,
				paymentAmount: data.amount,
				merchantOrderId: id,
				productDetails: data.productDetails,
				email: data.userEmail,
				paymentMethod: data.paymentMethod,
				customerVaName: data.userName,
				returnUrl: '',
				callbackUrl: this.getCallbackUrl(),
				signature: createHash('md5')
					.update(this.options.merchantCode + id + data.amount + this.options.apiKey)
					.digest('hex'),
			};

			const resp: AxiosResponse<ITransaction> = await axiosInst.post(
				this.getCreateTransactionUrl(),
				_data,
			);

			if (resp.data) {
				await this.paymentService.create({
					userId: data.userId,
					paymentMethod: 'duitku',
					paymentId: id,
					date: datetime,
				});

				return resp.data;
			}
			return null;
		} catch (e: any) {
			console.log('ERROR ON CREATE DUITKU TRANSACTION', e.response);
			throw new BadRequestException('Error on create transaction', e.response.data.Message);
		}
	}

	public async getPaymentMethods(params: IGetPaymentMethodsParams): Promise<IPaymentMethodItem[]> {
		const datetime = moment().format('yyyy-MM-DD HH:mm:ss');

		const data = {
			merchantcode: this.options.merchantCode,
			amount: params.amount,
			datetime,
			signature: createHash('sha256')
				.update(this.options.merchantCode + params.amount + datetime + this.options.apiKey)
				.digest('hex'),
		};

		try {
			const resp: AxiosResponse<IGetPaymentMethodsResp> = await axiosInst.post(
				this.getFetchPaymentMethodUrl(),
				data,
			);

			if (resp.data && resp.data.paymentFee) return resp.data.paymentFee;

			return [];
		} catch (e) {
			console.log('ERROR ON GET DUITKU PAYMENT METHODS', e);
			throw new BadRequestException('Error on get payment methods', e);
			// return PAYMENT_METHODS_MOCK
		}
	}

	public async checkTransaction(paymentId: string): Promise<void> {
		const data = {
			merchantcode: this.options.merchantCode,
			merchantOrderId: paymentId,
			signature: createHash('md5')
				.update(this.options.merchantCode + paymentId + this.options.apiKey)
				.digest('hex'),
		};
		try {
			const resp: AxiosResponse = await axiosInst.post(this.getTransactionStatusUrl(), data);

			if (resp.data.statusCode === '00') {
				const payment = await this.paymentRepository.findOne({
					where: { paymentId: resp.data.merchantOrderId },
				});

				await this.eventEmitter.emit(Events.IncreaseWalletBalance, {
					userId: payment.userId,
					value: resp.data.amount,
					currency: PaymentCurrency.idr,
				});

				await this.paymentRepository.update(payment.id, {
					status: PaymentStatus.CompletePayment,
				});

				this.wsService.emitToUser(payment.userId, 'close/browser');
			}

			return;
		} catch (e) {
			console.log('ERROR ON GET CHECK TRANSACTION', e);
			throw new BadRequestException('Error on check transaction', e);
		}
	}
}

// SUCCESS RESPONSE ON CREATE TRANSACTION

// ** merchantOrderId: '1' **

// data: {
//     merchantCode: 'DS15594',
//     reference: 'DS15594232M8ESO7B42PS1VR',
//     paymentUrl: 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS15594232M8ESO7B42PS1VR',
//     statusCode: '00',
//     statusMessage: 'SUCCESS'
// }

// ** merchantOrderId: '2' **

// data: {
//     merchantCode: 'DS15594',
//     reference: 'DS1559423YM3YVHCBKA7NACA',
//     paymentUrl: 'https://sandbox.duitku.com/topup/topupdirectv2.aspx?ref=M223BFV365X4MBFQQFJ',
//     vaNumber: '8941012747130065',
//     amount: '30000',
//     statusCode: '00',
//     statusMessage: 'SUCCESS'
// }
