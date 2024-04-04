import { DynamicModule, Module } from '@nestjs/common';
import { EmployersModule, TalentsModule, UsersModule } from '~api/domain';
import { AppDuitkuService } from './app-duitku.service';
import { AppDuitkuController } from './app-duitku.controller';
import { DuitkuModule } from '~api/domain/duitku/duitku.module';

@Module({})
export class AppDuitkuModule {
	static forRoot(): DynamicModule {
		return {
			module: AppDuitkuModule,
			imports: [
				DuitkuModule.forFeature(),
				UsersModule.forFeature(),
				TalentsModule.forFeature(),
				EmployersModule.forFeature(),
			],
			providers: [AppDuitkuService],
			controllers: [AppDuitkuController],
		};
	}
}
