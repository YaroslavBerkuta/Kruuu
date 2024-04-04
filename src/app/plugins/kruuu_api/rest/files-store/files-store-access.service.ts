import { Inject, Injectable } from '@nestjs/common';

import { GALLERY_REPOSITORY } from '~api/domain/galleries/consts';
import { IGalleriesRepository, IGalleryModel } from '~api/domain/galleries/interface';
import { StoreFileDto } from './dto';

@Injectable()
export class FilesStoreAccessService {
	@Inject(GALLERY_REPOSITORY) galleryRepository: IGalleriesRepository;

	public async checkAccess(userId: number, dto: StoreFileDto) {
		console.log('userId', userId, dto);

		if (dto.directory === 'talents' && String(userId) !== String(dto.parentId)) return false;
		if (dto.directory === 'talentWorkImages' && String(userId) !== String(dto.parentId))
			return false;

		return true;
	}

	public async checkAccessToRemove(userId: number, galleryItem: IGalleryModel) {
		if (galleryItem.parentTable === 'talents') {
			if (galleryItem.parentId !== String(userId)) return false;
		}

		return true;
	}
}
