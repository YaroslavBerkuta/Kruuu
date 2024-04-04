export enum Currency {
	Credit = 'cr',
	USD = 'usd',
	INR = 'inr',
	IDR = 'idr',
	KruuuCoin = 'krcoin',
}


export const PaymentCurrency = {
	[Currency.USD]: 'usd',
	[Currency.IDR]: 'idr',
}

export const getKeyByValue = (object, value): any => {
	return Object.keys(object).find(key => object[key] === value)
}
