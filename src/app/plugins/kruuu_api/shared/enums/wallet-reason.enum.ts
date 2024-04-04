export enum WalletReason {
	Trasferred = 't',
	Incomming = 'i',
	Pending = 'p',
	Buying = 'b',
	BuyingRupiah = 'br',
	AcceptApplication = 'aa',
}

export const WalletReasonLabel = {
	[WalletReason.Buying]: 'Buying credits',
	[WalletReason.Incomming]: 'Incoming from',
	[WalletReason.Pending]: 'Pending from',
	[WalletReason.Trasferred]: 'Transferred to',
	[WalletReason.BuyingRupiah]: 'Top Up Rp balance',
	[WalletReason.AcceptApplication]: 'Accept job application',
};
