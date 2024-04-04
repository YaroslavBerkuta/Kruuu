import { apiClient } from 'lisk-sdk';

export interface IBlockApiService {
	api: apiClient.APIClient;
	createUserSignedTx(userId: number, payload: ICreateUserSignedTxPayload);
	faucetUserBalance(userId: number, amount: string, index?: number): Promise<void>;
	getUserIdByAddress(address: string): Promise<number>;
	hasTokens(tokens: string, userId: number): Promise<boolean>;
	initDIDdocument(userId: number): Promise<void>;
	getUserPublicKey(userId: number): Promise<string>;
	getUserPrivateKey(userId: number): Promise<Buffer>;
	getUserDID(userId: number): Promise<string>;
}
export interface ICreateUserSignedTxPayload {
	module?: string;
	command: string;
	fee?: any;
	params?: any;
}
