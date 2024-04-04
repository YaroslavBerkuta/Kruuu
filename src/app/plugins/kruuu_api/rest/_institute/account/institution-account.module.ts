import { DynamicModule, Module } from '@nestjs/common';
import { InstitutionModule, UsersModule } from '~api/domain';
import { InstitutionAccountController } from './institution-account.controller';
import { InstitutionAccountService } from './institution-account.service';

@Module({})
export class InstitutionAccountModule {
	static forRoot(): DynamicModule {
		return {
			module: InstitutionAccountModule,
			providers: [InstitutionAccountService],
			controllers: [InstitutionAccountController],
			imports: [InstitutionModule.forFeature(), UsersModule.forFeature()],
		};
	}
}
