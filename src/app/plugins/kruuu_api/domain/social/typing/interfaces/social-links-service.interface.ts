import { SocialLinkKey } from '../enums';
import { ISocialLink } from './social-link.interface';

export interface ISocialLinksService {
	put(payload: IPutSocialLinksPayload): Promise<ISocialLink[]>;
	get(params: IGetSocialLinksParams): Promise<ISocialLink[]>;
	delete(payload: IGetSocialLinksParams): Promise<void>;
}

export interface IPutSocialLinksPayload {
	parentId: number;
	parentType: string;

	items: {
		key: SocialLinkKey;
		value: string;
	}[];
}

export interface IGetSocialLinksParams {
	parentId: number;
	parentType: string;
}
