import { IoAdapter } from '@nestjs/platform-socket.io';

import * as redisIoAdapter from 'socket.io-redis';
import { getEnv } from '~api/shared';

export class RedisIoAdapter extends IoAdapter {
	createIOServer(port: number, options?: any): any {
		const server = super.createIOServer(port, options);
		const createAdapter: any = redisIoAdapter;
		const redisAdapter = createAdapter({
			host: getEnv('REDIS_HOST'),
			port: Number(getEnv('REDIS_PORT')),
			password: getEnv('REDIS_PASS'),
			// keyPrefix: configService.get('REDIS_PREFIX'),
		});

		server.adapter(redisAdapter);
		return server;
	}
}
