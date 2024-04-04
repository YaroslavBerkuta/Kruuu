import { IProject } from '~api/domain/projects/typing';
import { StoreProjectsPayloadDto, UpdateProjectsPayloadDto } from '../dto';

export const createProjectPayloadToBlockainParams = (payload: Partial<StoreProjectsPayloadDto>) => {
	return {
		employer: '',
		signature: Buffer.alloc(0),
		properties: payloadToProperties(payload),
	};
};

const payloadToProperties = (payload: Partial<StoreProjectsPayloadDto>) => {
	const properties: { key: string; value: string }[] = [];

	Object.keys(payload).map(key => {
		properties.push({ key, value: String(payload[key]) });
	});

	return properties;
};

export const createProjectPayloadToUpdateProject = (
	exist: IProject,
	payload: UpdateProjectsPayloadDto,
	author: string,
) => {
	const clearedPayload: Record<string, string> = {};

	Object.keys(payload).map(key => {
		const val1 = String(exist[key]);
		const val2 = String(payload[key]);
		if (val1 !== val2) clearedPayload[key] = payload[key];
	});

	console.log('clearedPayload', author);

	return {
		project: exist.blochaineUuid,
		updates: [
			{
				type: 'updateProject',
				properties: payloadToProperties(clearedPayload),
			},
		],
		author,
		signature: Buffer.alloc(0),
	};
};
