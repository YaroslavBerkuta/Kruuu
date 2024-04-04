import { Repository } from 'typeorm';
import { ISocialLink } from './social-link.interface';

export type SocialLinksRepository = Repository<ISocialLink>;
