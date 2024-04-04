import { isNil } from 'lodash';

export const dataToProperties = (data: Record<string, any>, ommitKeys: string[]) => {
	const result: any = [];

	console.log(data);

	Object.keys(data).map(key => {
		if (!ommitKeys.includes[key]) {
			const value = ['string', 'number'].includes(typeof data[key])
				? String(data[key])
				: JSON.stringify(data[key]);

			if (!isNil(value)) result.push({ key, value });
		}
	});
	return result;
};
