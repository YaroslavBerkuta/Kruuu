import { BasePlugin, apiClient, cryptography } from 'lisk-sdk';
import { Server } from 'http';
import * as express from 'express';
import * as cors from 'cors';
import { FAUCET_AMOUNT, GENESIS_ACCOUNT_PRIVATE_KEY } from './config';

interface FaucetBodyRequest {
	address: string;
}

interface UserStoreData {
	availableBalance: bigint;
	lockedBalances: {
		module: string;
		amount: bigint;
	}[];
}

interface AuthAccountJSON {
	nonce: string;
	numberOfSignatures: number;
	mandatoryKeys: string[];
	optionalKeys: string[];
}

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class KruuuFaucetPlugin extends BasePlugin {
	private _server: Server | undefined = undefined;
	private _app: express.Express | undefined = undefined;
	private _client: apiClient.APIClient | undefined = undefined;

	public async getClient() {
		if (!this._client) {
			this._client = await apiClient.createIPCClient('~/.lisk/kruuu-core');
		}
		return this._client;
	}

	public get nodeModulePath(): string {
		return __filename;
	}

	public async load(): Promise<void> {
		this.logger.info('KRU Faucet is for Development Purposes only!');
		try {
			const client = await this.getClient();
			this._app = express();

			this._app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'] }));
			this._app.use(express.json());

			this._app.post('/faucet', async (req, res) => {
				try {
					if (!this._client) throw new Error('client is undefined');

					const nodeInfo = await this._client.invoke('system_getNodeInfo');
					const transaction = await this._client.transaction.create(
						{
							module: 'token',
							command: 'transfer',
							fee: BigInt(10000000),
							params: {
								tokenID: `${nodeInfo.chainID}00000000`,
								amount: FAUCET_AMOUNT,
								recipientAddress: cryptography.address.getLisk32AddressFromAddress(
									Buffer.from((req.body as FaucetBodyRequest).address, 'hex'),
								),
								data: 'KRU Devnet Faucet',
							},
						},
						GENESIS_ACCOUNT_PRIVATE_KEY,
					);

					await this._client.transaction.send(transaction);
					res.status(200).json({ data: 'success', meta: req.body as Record<string, string> });
				} catch (err: unknown) {
					res
						.status(409)
						.json({ data: (err as string).toString(), meta: req.body as Record<string, string> });
				}
			});

			/**
			 * Get Token Information of an account, according to Lisk Token Module
			 * See here: https://github.com/LiskHQ/lisk-sdk/tree/development/framework/src/modules/token
			 */
			this._app.get('/token/:address', async (req, res) => {
				try {
					if (!this._client) throw new Error('client is undefined');

					const { address } = req.params;
					const nodeInfo = await this._client.invoke('system_getNodeInfo');
					const accountToken: UserStoreData = await client.invoke('token_getBalance', {
						address: cryptography.address.getLisk32AddressFromAddress(Buffer.from(address, 'hex')),
						tokenID: `${nodeInfo.chainID}00000000`,
					});

					if (Object.keys(accountToken).includes('error')) {
						throw new Error(
							(accountToken as unknown as { error: Record<string, string> }).error.message,
						);
					}

					res.status(200).json({ data: accountToken, meta: req.params as Record<string, string> });
				} catch (err: unknown) {
					res
						.status(409)
						.json({ data: (err as string).toString(), meta: req.body as Record<string, string> });
				}
			});

			/**
			 * Get Auth Information of an account, according to Lisk Auth Module
			 * See here: https://github.com/LiskHQ/lisk-sdk/tree/development/framework/src/modules/auth
			 */
			this._app.get('/auth/:address', async (req, res) => {
				try {
					if (!this._client) throw new Error('client is undefined');

					const { address } = req.params;
					const accountAuth: AuthAccountJSON = await client.invoke('auth_getAuthAccount', {
						address: cryptography.address.getLisk32AddressFromAddress(Buffer.from(address, 'hex')),
					});

					if (Object.keys(accountAuth).includes('error')) {
						throw new Error(
							(accountAuth as unknown as { error: Record<string, string> }).error.message,
						);
					}

					res.status(200).json({ data: accountAuth, meta: req.params as Record<string, string> });
				} catch (err: unknown) {
					res
						.status(409)
						.json({ data: (err as string).toString(), meta: req.body as Record<string, string> });
				}
			});

			this._server = this._app.listen(8881, '0.0.0.0');
		} catch (err) {
			this.logger.info('Faucet is disabled');
		}
	}

	public async unload(): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			if (this._server) {
				this._server.close((err: unknown) => {
					if (err) {
						reject(err);
						return;
					}
					resolve();
				});
			}
		});
	}
}
