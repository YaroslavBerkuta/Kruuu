export const createProjectSchema = {
	$id: 'CreateProjectCommand',
	type: 'object',
	properties: {
		properties: {
			type: 'array',
			fieldNumber: 1,
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
		employer: {
			dataType: 'string',
			fieldNumber: 2,
		},
		signature: {
			dataType: 'bytes',
			fieldNumber: 3,
		},
	},
};
