import { IStoreProjectPayload } from '../../../domain/projects/typing';

export const transformBlockhainProject = (
	blochaineUuid: string,
	project: any,
	userId: number,
): IStoreProjectPayload => {
	const properties: Record<string, any> = {};
	project.properties.map(it => {
		properties[it.key] = it.value;
	});

	return {
		creatorId: userId,
		title: properties.title,
		industryId: properties.industryId,
		typeId: properties.typeId,
		startingDate: properties.startingDate,
		duration: properties.duration,
		location: properties.location,
		descriptions: properties.descriptions,
		budget: properties.budget,
		lockedTokenBeddows: String(project.lockedToken),
		blochaineUuid,
		uniqueKey: properties.uniqueKey,
		meta: {
			blockUpdatesCount: (project.updates as any[]).length,
		},
	};
};
