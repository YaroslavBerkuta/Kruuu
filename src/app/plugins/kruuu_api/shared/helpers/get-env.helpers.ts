const testEnv = {
	AUTO_SEED_ENABLED: true,
};

const isTest = process.env.NODE_ENV === 'test';

export const getEnv = (name: string, _optional = false): string => {
	const value = isTest ? testEnv[name] : process.env[name];

	// TODO: temporary fix
	// NOTE: this line is commented, in order to --enable-kruuu-plugins to be compatible
	// if (!_optional && (value === undefined || value === null))
	// 	throw new Error('Not found env var: ' + name);

	return value;
};
