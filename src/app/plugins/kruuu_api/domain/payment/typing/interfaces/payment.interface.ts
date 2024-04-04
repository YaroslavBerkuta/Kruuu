import { PaymentStatus } from '../enums';

export interface IPayment {
	id: number;

	status: PaymentStatus;
	data?: string;
	paymentMethod: string;
	paymentId: string;

	userId: number;

	createdAt?: string;
	updatedAt?: string;
}
