export interface IGoogleModuleParams {
	clientId: string;
}

export interface IGoogleAsyncModuleParams {
	imports?: any[];
	useFactory: (...args: any[]) => Promise<IGoogleModuleParams>;
	inject: any[];
}
