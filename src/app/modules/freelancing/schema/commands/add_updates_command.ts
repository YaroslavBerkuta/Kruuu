export const addUpdatesSchema = {
	$id: 'AddUpdatesCommand',
	type: 'object',
	properties: {
		project: {
			dataType: 'string',
			fieldNumber: 1,
		},
		updates: {
			type: 'array',
			fieldNumber: 2,
			items: {
				type: 'object',
				required: ['type', 'properties'],
				properties: {
					type: {
						dataType: 'string',
						fieldNumber: 1,
					},
					properties: {
						type: 'array',
						fieldNumber: 2,
						items: {
							type: 'object',
							required: ['key', 'value'],
							properties: {
								key: {
									dataType: 'string',
									fieldNumber: 1,
								},
								value: {
									dataType: 'string',
									fieldNumber: 2,
								},
							},
						},
					},
				},
			},
		},
		author: {
			dataType: 'string',
			fieldNumber: 3,
		},
		signature: {
			dataType: 'bytes',
			fieldNumber: 4,
		},
	},
};
