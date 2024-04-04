export interface ITransaction {
	merchantCode: string;
	reference: string;
	paymentUrl: string;
	vaNumber?: string;
	qrString?: string;
	amount?: string;
	statusCode: string;
	statusMessage: string;
}
