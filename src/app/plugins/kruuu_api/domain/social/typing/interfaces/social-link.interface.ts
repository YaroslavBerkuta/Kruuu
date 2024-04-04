import { SocialLinkKey } from '../enums';

export interface ISocialLink {
	id: number;
	parentType: string;

	parentId: number;
	key: SocialLinkKey;
	value: string;
}
