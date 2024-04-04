export const newUpdatesEventSchema = {
	$id: '/freelancing/events/new_updates',
	type: 'object',
	required: ['updates'],
	properties: {
		updates: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['type', 'author', 'transaction', 'properties'],
				properties: {
					type: {
						dataType: 'string',
						fieldNumber: 1,
					},
					author: {
						dataType: 'string',
						fieldNumber: 2,
					},
					transaction: {
						dataType: 'bytes',
						fieldNumber: 3,
					},
					properties: {
						type: 'array',
						fieldNumber: 4,
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
	},
};
