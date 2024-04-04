import { did } from 'lisk-did';
import { PROJECT_DID_NAMESPACE } from '../constants/chain';

export function getProjectDid(chainspace: string, projectKey: Buffer) {
	return `did:lisk:${chainspace}:${PROJECT_DID_NAMESPACE}:${projectKey.toString('hex')}`;
}

export function getProjectIdentity(chainspace: string, project: string) {
	let projectKey: Buffer = Buffer.from(project, 'hex');
	let projectDid = getProjectDid(chainspace, projectKey);

	if (project.startsWith('did:lisk')) {
		projectDid = project;
		projectKey = Buffer.from(did.parseDIDComponent(project).uniqueId, 'hex');
	}

	return { projectKey, projectDid };
}
