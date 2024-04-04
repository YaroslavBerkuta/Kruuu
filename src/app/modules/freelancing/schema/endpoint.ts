import { accountStoreSchemaJSON } from './stores/account';
import { projectStoreSchemaJSON } from './stores/project';

export const getAccountRequestSchema = {
	$id: '/freelancing/endpoint/getAccount/request',
	type: 'object',
	required: ['did'],
	properties: {
		did: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const getAccountResponseSchema = accountStoreSchemaJSON;

export const getProjectRequestSchema = {
	$id: '/freelancing/endpoint/getProject/request',
	type: 'object',
	required: ['project'],
	properties: {
		project: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const getProjectResponseSchema = projectStoreSchemaJSON;

export const getProjectListRequestSchema = {
	$id: '/freelancing/endpoint/getProjectList/request',
	type: 'object',
	required: ['project'],
	properties: {
		project: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const getProjectListResponseSchema = {
	$id: '/freelancing/endpoint/getProjectList/response',
	type: 'object',
	required: ['projects'],
	properties: {
		projects: {
			type: 'array',
			fieldNumber: 1,
			items: projectStoreSchemaJSON,
		},
	},
};
