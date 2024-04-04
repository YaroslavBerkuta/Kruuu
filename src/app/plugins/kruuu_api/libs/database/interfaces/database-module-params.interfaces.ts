import { DataSourceOptions } from 'typeorm';

export interface IDatabaseAsyncModuleParams {
	imports?: any[];
	useFactory: (...args: any[]) => Promise<Partial<DataSourceOptions>>;
	inject: any[];
}
