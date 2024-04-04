/* eslint-disable no-console */
import { BasePlugin } from 'lisk-sdk';
import { INestApplication } from '@nestjs/common';
import { logger } from './shared/logger';
import { bootstrap } from './main';

export class KruuuApiPlugin extends BasePlugin {
	public get nodeModulePath(): string {
		return __filename;
	}

	private _server: INestApplication | undefined = undefined;

	public async unload(): Promise<void> {
		await this._server?.close();
		logger.warn('Unload');
	}

	public async load() {
		this._server = await bootstrap(8080);
		logger.log('Kru api plugin init');
	}
}
