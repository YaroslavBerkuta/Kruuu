import { IPaymentMethodItem } from './payment-method.interface';
import { ITransaction } from './transaction.interface';

export interface IGetPaymentMethodsParams {
	amount: string | number;
}

export interface ICreateTransactionData {
	userId: number;
	amount: string | number;
	productDetails: string;
	userEmail: string;
	paymentMethod: string;
	userName: string;
}

export interface IDuitkuService {
	createTransaction(data: ICreateTransactionData): Promise<ITransaction>;
	getPaymentMethods(params: IGetPaymentMethodsParams): Promise<IPaymentMethodItem[]>;
	checkTransaction(paymentId: string): Promise<void>;
}
