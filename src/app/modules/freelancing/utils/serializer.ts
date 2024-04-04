export function serializer(data: Record<any, any>): Record<any, any> {
	if (data === undefined) return data;
	return JSON.parse(
		JSON.stringify(data, (_, value) => {
			if (Array.isArray(value)) {
				return value.map(item => replacer(item));
			}
			return replacer(value);
		}),
	);
}

function replacer(value: any) {
	if (typeof value === 'bigint') {
		return value.toString();
	}
	if (value.type === 'Buffer') {
		return Buffer.from(value).toString('hex');
	}
	return value;
}
