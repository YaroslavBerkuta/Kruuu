export const projectStoreSchema = {
	$id: '/freelancing/project',
	type: 'object',
	required: ['did', 'employer', 'talents', 'updates', 'properties'],
	properties: {
		did: {
			dataType: 'string',
			fieldNumber: 1,
		},
		employer: {
			dataType: 'string',
			fieldNumber: 2,
		},
		talents: {
			type: 'array',
			fieldNumber: 3,
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
		updates: {
			type: 'array',
			fieldNumber: 4,
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
		properties: {
			type: 'array',
			fieldNumber: 5,
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
};

export const projectStoreSchemaJSON = {
	$id: '/freelancing/project/json',
	type: 'object',
	required: ['did', 'employer', 'talents', 'updates', 'properties'],
	properties: {
		did: {
			dataType: 'string',
			fieldNumber: 1,
		},
		employer: {
			dataType: 'string',
			fieldNumber: 2,
		},
		talents: {
			type: 'array',
			fieldNumber: 3,
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
		updates: {
			type: 'array',
			fieldNumber: 4,
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
						dataType: 'string',
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
		properties: {
			type: 'array',
			fieldNumber: 5,
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
};
