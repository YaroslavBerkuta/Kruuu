import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Global()
@Module({})
export class DatabaseModule {
	public static forRoot(options: Partial<DataSourceOptions>, entities: any[]): DynamicModule {
		return {
			module: DatabaseModule,
			imports: [TypeOrmModule.forRoot({ ...options, entities, name: 'default' })],
		};
	}
}
