import { Inject, Injectable } from '@nestjs/common';
import { GALLERY_REPOSITORY } from '../consts';
import {
	IGalleriesRepository,
	IGalleryService,
	IGetGalleryParams,
	IStoreGalleryPayload,
} from '../interface';
import * as _ from 'lodash';
import { transformFileUrl } from '~api/shared';

@Injectable()
export class GalleryService implements IGalleryService {
	@Inject(GALLERY_REPOSITORY) private readonly galleryRepository: IGalleriesRepository;

	public async store(dto: IStoreGalleryPayload) {
		return await this.galleryRepository.save({
			fileUrl: dto.fileUrl,
			parentTable: dto.parentTable,
			parentId: String(dto.parentId),
			data: dto.data,
			fileName: dto.fileName,
			mimetype: dto.mimetype,
		});
	}

	public async delete(id: number) {
		await this.galleryRepository.delete(id);
		return;
	}

	public async get(dto: IGetGalleryParams) {
		const gallery = await this.galleryRepository.find({
			where: { parentId: String(dto.parentId), parentTable: dto.parentTable },
		});

		return _.defaultTo(
			gallery.map(it => {
				return {
					...it,
					fileUrl: transformFileUrl(it.fileUrl),
				};
			}),
			[],
		);
	}

	public async associateProccessFiles(proccessId: string, newId: string, newDirectory: string) {
		const proccessItems = await this.galleryRepository.find({
			where: {
				parentId: proccessId,
				parentTable: 'proccessEntities',
			},
		});
		if (_.isEmpty(proccessItems)) return;

		for await (const item of proccessItems) {
			await this.galleryRepository.update(item.id, {
				parentId: newId,
				parentTable: newDirectory,
			});
		}
	}
}
