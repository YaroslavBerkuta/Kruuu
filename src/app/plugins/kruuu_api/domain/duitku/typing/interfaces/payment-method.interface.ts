export interface IPaymentMethodItem {
	paymentMethod: string;
	paymentName: string;
	paymentImage: string;
	totalFee: string;
}

export interface IGetPaymentMethodsResp {
	paymentFee: IPaymentMethodItem[];
	responseCode: string; // "00" | "01" | "02" etc
	responseMessage: string;
}
