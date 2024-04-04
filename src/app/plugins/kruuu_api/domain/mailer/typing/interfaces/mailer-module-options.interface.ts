export interface IMailerModuleOptions {
	test: boolean;
	domain?: string;
	port?: number;
	login?: string;
	password?: string;
	protocol?: string;
	secure?: boolean;
}
