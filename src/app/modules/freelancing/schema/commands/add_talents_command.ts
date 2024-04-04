export const addTalentsSchema = {
	$id: 'AddTalentsCommand',
	type: 'object',
	properties: {
		project: {
			dataType: 'string',
			fieldNumber: 1,
		},
		talents: {
			type: 'array',
			fieldNumber: 2,
			items: {
				type: 'object',
				required: ['subject', 'properties'],
				properties: {
					subject: {
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
		signature: {
			dataType: 'bytes',
			fieldNumber: 3,
		},
	},
};
