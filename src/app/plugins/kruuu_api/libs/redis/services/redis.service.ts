import { Inject, Injectable } from '@nestjs/common';
import Redis, * as IORedis from 'ioredis';
import { REDIS_OPTIONS } from '../consts';
import { IRedisModuleOptions } from '../interfaces';

@Injectable()
export class RedisService {
	private readonly client: IORedis.Redis;

	constructor(@Inject(REDIS_OPTIONS) options: IRedisModuleOptions) {
		this.client = new Redis(options);
	}

	async set(key: IORedis.RedisKey, value: IORedis.RedisValue, lifeTime?: number) {
		if (lifeTime) await this.client.set(key, value, 'EX', lifeTime);
		else await this.client.set(key, value);
	}

	async get(key: IORedis.RedisKey) {
		const result = await this.client.get(key);
		return result;
	}

	async del(key: IORedis.RedisKey) {
		await this.client.del(key);
	}
}
