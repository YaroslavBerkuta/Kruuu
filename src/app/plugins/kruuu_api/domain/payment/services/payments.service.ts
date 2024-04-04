import { Inject, Injectable } from '@nestjs/common';
import {
	ICreatePaymentPayload,
	IPaymentRepository,
	IPaymentService,
	PAYMENT_REPOSITORY,
	PaymentStatus,
} from '../typing';

@Injectable()
export class PaymentService implements IPaymentService {
	@Inject(PAYMENT_REPOSITORY) private readonly paymentRepository: IPaymentRepository;

	public async create(payload: ICreatePaymentPayload) {
		const payment = await this.paymentRepository.save({
			status: PaymentStatus.WaitPayment,
			date: payload.date,
			paymentMethod: payload.paymentMethod,
			paymentId: payload.paymentId,
			userId: payload.userId,
		});

		return payment;
	}
}
