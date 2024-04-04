import { Repository } from 'typeorm';
import { ITag } from './tag.interface';

export type ITagsRepository = Repository<ITag>;
