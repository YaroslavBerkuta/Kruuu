export const accountStoreSchema = {
	$id: '/freelancing/account',
	type: 'object',
	required: ['employerOf', 'talentOf'],
	properties: {
		employerOf: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'string',
			},
		},
		talentOf: {
			type: 'array',
			fieldNumber: 2,
			items: {
				dataType: 'string',
			},
		},
	},
};

export const accountStoreSchemaJSON = accountStoreSchema;
