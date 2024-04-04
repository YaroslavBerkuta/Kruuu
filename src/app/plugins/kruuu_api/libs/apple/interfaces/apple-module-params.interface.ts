export interface IAppleAsyncModuleParams {
	imports?: any[];
	useFactory: (...args: any[]) => Promise<IAppleModuleParams>;
	inject: any[];
}

export interface IAppleModuleParams {
	appleAppId: string;
}
