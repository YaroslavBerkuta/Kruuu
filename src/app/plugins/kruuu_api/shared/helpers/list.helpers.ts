import * as _ from 'lodash';

export const clearList = (list: { items: any[]; count: number }) => {
	return {
		items: list.items.map(item => _.omitBy(item, _.isNil)),
		count: list.count,
	};
};
