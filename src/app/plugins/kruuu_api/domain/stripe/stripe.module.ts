import { DynamicModule, Module } from '@nestjs/common';
import { IStripeOptions, STRIPE_OPTIONS, STRIPE_SERVICE } from './typing';
import { StripeService } from './services/stripe.service';
import { provideClass } from '~api/shared';
import { STRIPE_SEED } from './seeders';
import { PaymentModule } from '../payment/payment.module';
import { RealTimeModule } from '../real-time/real-time.module';
import { StripeController } from './stripe.controller';
import { UsersModule } from '../users/users.module';

@Module({})
export class StripeModule {
	static options: IStripeOptions;

	static getProviders() {
		return [
			provideClass(STRIPE_SERVICE, StripeService),
			{ provide: STRIPE_OPTIONS, useValue: this.options },
		];
	}

	static forRoot(options: IStripeOptions): DynamicModule {
		StripeModule.options = options;
		return {
			module: StripeModule,
			providers: [...this.getProviders(), ...STRIPE_SEED],
			imports: [PaymentModule.forFeature(), RealTimeModule.forFeature(), UsersModule.forFeature()],
			controllers: [StripeController],
		};
	}
	static forFeature(): DynamicModule {
		return {
			module: StripeModule,
			providers: this.getProviders(),
			exports: [STRIPE_SERVICE],
			imports: [PaymentModule.forFeature(), RealTimeModule.forFeature(), UsersModule.forFeature()],
			controllers: [StripeController],
		};
	}
}
