export interface IPushNotifcationsModuleParams {
	appId: string;
	restApiKey: string;
	useService: PushNotificationsServiceType;
}

export type PushNotificationsServiceType = 'one-signal';
