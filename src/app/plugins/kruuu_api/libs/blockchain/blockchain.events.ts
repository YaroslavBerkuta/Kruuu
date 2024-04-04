import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { apiClient } from 'lisk-sdk';
import { CORE_API } from '~api/shared';
import { REAL_TIME_SERVICE, WSService } from '~api/domain/real-time/typing';
import { isEmpty } from 'lodash';

@Injectable()
export class BlockchainEvents implements OnModuleDestroy, OnModuleInit {
	@Inject(CORE_API)
	public readonly api: apiClient.APIClient;

	@Inject(REAL_TIME_SERVICE) private wsService: WSService;

	protected timmer = null;

	onModuleInit() {
		this.api.event.subscribe(
			events => {
				if (isEmpty(events)) return;

				if (this.timmer) clearTimeout(this.timmer);
				this.timmer = setTimeout(() => {
					this.wsService.emitToAll('newTransaction');
				}, 500);
			},
			{
				module: 'txpool',
				name: 'newTransaction',
			},
		);
	}

	onModuleDestroy() {
		if (this.timmer) clearTimeout(this.timmer);
	}
}
