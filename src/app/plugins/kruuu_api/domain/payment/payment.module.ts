import { DynamicModule, Module } from '@nestjs/common';
import { provideEntity } from '~api/libs';
import { PAYMENT_REPOSITORY, PAYMENT_SERVICE } from './typing';
import { Payment } from './entities';
import { provideClass } from '~api/shared';
import { PaymentService } from './services/payments.service';
import { PaymentEventService } from './services/payment-events.service';
import { WalletsModule } from '../wallets/wallets.module';

@Module({})
export class PaymentModule {
	static getProviders() {
		return [
			provideEntity(PAYMENT_REPOSITORY, Payment),
			provideClass(PAYMENT_SERVICE, PaymentService),
		];
	}

	static import() {
		return [WalletsModule.forFeature()];
	}

	static forRoot(): DynamicModule {
		return {
			module: PaymentModule,
			providers: [...this.getProviders(), PaymentEventService],
			imports: this.import(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: PaymentModule,
			providers: this.getProviders(),
			exports: [PAYMENT_REPOSITORY, PAYMENT_SERVICE],
			imports: this.import(),
		};
	}
}
