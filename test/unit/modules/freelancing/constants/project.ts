import { ProjectStoreData } from '../../../../../src/app/modules/freelancing/stores/project';
import { chainspace, employerDid } from './account';
import { PROJECT_DID_NAMESPACE } from '../../../../../src/app/modules/freelancing/constants/chain';
import { chainID } from './config';

export const projectId = BigInt(0);

export const projectDid = `did:lisk:${chainspace}:${PROJECT_DID_NAMESPACE}:${chainID.toString(
	'hex',
)}0000000000000000`;

export const projectData: ProjectStoreData = {
	did: projectDid,
	employer: employerDid,
	properties: [],
	talents: [],
	updates: [],
};
