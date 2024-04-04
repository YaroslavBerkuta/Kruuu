export interface IGetTokensBalanceResult {
	availableBalance: string;
	lockedBalances: {
		module: string;
		amount: string;
	}[];
}

export interface AuthAccountJSON {
	nonce: string;
	numberOfSignatures: number;
	mandatoryKeys: string[];
	optionalKeys: string[];
}
