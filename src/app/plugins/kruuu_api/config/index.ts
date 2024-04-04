import { getEnv, stringToBoolean } from '~api/shared';
import { ENTITIES } from './entities.config';
import { DatabaseModule } from '~api/libs';
import { IFilesStorageOptions } from '~api/libs/file-storage/interfaces';
import { IRedisModuleOptions } from '~api/libs/redis/interfaces';
import { IMailerModuleOptions } from '~api/domain/mailer/typing';
import { IStripeOptions } from '~api/domain/stripe/typing';
import {
	IPushNotifcationsModuleParams,
	PushNotificationsServiceType,
} from '~api/libs/push-notifications/interfaces';
import { IDuitkuOptions } from '~api/domain/duitku/typing';
import { cryptography } from 'lisk-sdk';

const getDatabaseConfig = (): Parameters<typeof DatabaseModule['forRoot']> => {
	return [
		{
			type: 'postgres',
			host: process.env.DATABASE_HOST,
			port: Number(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASS,
			database: process.env.DATABASE_DB,
			ssl: process.env.DATABASE_SSL === 'true',
			synchronize: true,
		},
		ENTITIES,
	];
};

const getMailerConfig = (): IMailerModuleOptions => {
	return {
		domain: getEnv('MAILER_DOMAIN'),
		port: Number(getEnv('MAILER_PORT')),
		password: getEnv('MAILER_PASSWORD'),
		login: getEnv('MAILER_LOGIN'),
		protocol: getEnv('MAILER_PROTOCOL'),
		test: stringToBoolean(getEnv('MAILER_TEST_MODE')),
		secure: stringToBoolean(getEnv('MAILER_SECURE')),
	};
};

const getRedisConfig = (): IRedisModuleOptions => {
	return {
		port: Number(getEnv('REDIS_PORT')),
		host: getEnv('REDIS_HOST'),
		password: getEnv('REDIS_PASS'),
	};
};

export const getFilesStorageConfig = (): IFilesStorageOptions => {
	return {
		host: getEnv('MINIO_HOST'),
		port: Number(getEnv('MINIO_PORT')),
		accessKey: getEnv('MINIO_ACCESS_KEY'),
		secretKey: getEnv('MINIO_SECRET_KEY'),
		urlPrefix: getEnv('MINIO_URL_PREFIX'),
		bucket: getEnv('MINIO_BUCKET') || 'files',
		privateBucket: getEnv('MINIO_PRIVATE_BUCKET'),
	};
};
const getJwtConfig = () => {
	return { jwtKey: getEnv('JWT_KEY'), payloadKey: getEnv('JWT_PAYLOAD_KEY') };
};

const getStripeConfig = (): IStripeOptions => {
	return {
		apiKey: getEnv('STRIPE_PRIVATE_KEY'),
		config: {
			apiVersion: '2022-11-15',
			typescript: true,
		},
		webhookKey: getEnv('STRIPE_WEBHOOK_KEY'),
		success_url: getEnv('STRIPE_SUCCESS_URL'),
		product_name: getEnv('STRIPE_PRODUCT_NAME'),
	};
};

const getPushNotificationsConfig = (): IPushNotifcationsModuleParams => {
	return {
		appId: getEnv('PUSH_APP_ID'),
		restApiKey: getEnv('PUSH_REST_API_KEY'),
		useService: getEnv('PUSH_NOTIFICATIONS_SERVICE') as PushNotificationsServiceType,
	};
};

const getDuitkuConfig = (): IDuitkuOptions => {
	return {
		apiKey: getEnv('DUITKU_API_KEY'),
		merchantPrefixUrl: getEnv('DUITKU_MERCHANT_PREFIX_URL'),
		merchantCode: getEnv('DUITKU_MERCHANT_CODE'),
		callBackUrl: getEnv('DUITU_CALLBACK_URL'),
	};
};

export const getGenesisPrivateKey = async () => {
	const genesisPasspharse = getEnv('GENESIS_PASSHRASE');

	const privateKey = await cryptography.ed.getPrivateKeyFromPhraseAndPath(
		genesisPasspharse,
		"m/44'/134'/0'",
	);
	return privateKey;
};

export const $config = {
	getDatabaseConfig,
	getRedisConfig,
	getFilesStorageConfig,
	getJwtConfig,
	getStripeConfig,
	getDuitkuConfig,
	getPushNotificationsConfig,
	getMailerConfig,
};
