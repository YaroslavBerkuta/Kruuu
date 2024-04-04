import { DynamicModule, Module } from '@nestjs/common'
import { DUITKU_OPTIONS, DUITKU_SERVICE, IDuitkuOptions } from './typing'
import { DuitkuService } from './duitku.service'
import { DuitkuController } from './duitku.controller'
import { PaymentModule } from '../payment/payment.module'
import { RealTimeModule } from '../real-time/real-time.module'
import { provideClass } from '~api/shared'

@Module({})
export class DuitkuModule {
	static options: IDuitkuOptions

	static getProviders() {
		return [
			provideClass(DUITKU_SERVICE, DuitkuService),
			{ provide: DUITKU_OPTIONS, useValue: this.options },
		]
	}

	static forRoot(options: IDuitkuOptions): DynamicModule {
		DuitkuModule.options = options
		return {
			module: DuitkuModule,
			providers: [...this.getProviders()],
			imports: [PaymentModule.forFeature(), RealTimeModule.forFeature()],
			controllers: [DuitkuController],
		}
	}
	static forFeature(): DynamicModule {
		return {
			module: DuitkuModule,
			providers: this.getProviders(),
			exports: [DUITKU_SERVICE],
			imports: [PaymentModule.forFeature(), RealTimeModule.forFeature()],
			// controllers: [DuitkuController],
		}
	}
}
