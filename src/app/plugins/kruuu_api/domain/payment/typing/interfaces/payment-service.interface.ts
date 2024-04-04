import { IPayment } from './payment.interface';

export interface IPaymentService {
	create(payload: ICreatePaymentPayload): Promise<IPayment>;
}

export interface ICreatePaymentPayload {
	date: string;
	paymentMethod: string;
	paymentId: string;
	userId: number;
}
