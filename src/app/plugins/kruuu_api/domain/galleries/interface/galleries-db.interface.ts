import { Repository } from 'typeorm';
import { IGalleryModel } from './gallery.interface';

export type IGalleriesRepository = Repository<IGalleryModel>;
