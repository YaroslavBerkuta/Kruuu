import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { FinishFileUpload, RemoveFilesParamsDto, StoreFileDto } from './dto';

import * as randomstring from 'randomstring';
import { GALLERY_REPOSITORY, GALLERY_SERVICE } from '~api/domain/galleries/consts';
import {
	IGalleriesRepository,
	IGalleryService,
	IStoreGalleryPayload,
} from '~api/domain/galleries/interface';
import { FilesStoreAccessService } from './files-store-access.service';
import { In } from 'typeorm';
import { FileStorageService, RedisService } from '~api/libs';

@Injectable()
export class FilesStoreService {
	@Inject(GALLERY_SERVICE) galleryService: IGalleryService;
	@Inject(GALLERY_REPOSITORY) galleryRepository: IGalleriesRepository;

	constructor(
		private readonly filesStorageService: FileStorageService,
		private readonly redisService: RedisService,
		private readonly filesStoreAccessService: FilesStoreAccessService,
	) {}

	public async getLinkToUploadFile(userId: number, dto: StoreFileDto) {
		try {
			const canAccess = await this.filesStoreAccessService.checkAccess(userId, dto);
			if (!canAccess) throw new ForbiddenException('Not have permission to upload this file');

			const { presignedUrl, resultUrl } =
				await this.filesStorageService.getPresignedUrlForPutObject(dto.directory, dto.filename);

			const uploadId = randomstring.generate({
				length: 24,
				charset: 'alphabetic',
				capitalization: 'uppercase',
			});

			await this.redisService.set(
				uploadId,
				JSON.stringify({
					resultUrl,
					directory: dto.directory,
					parentId: dto.parentId,
					name: dto.filename,
					mimetype: dto.mimetype,
				}),
				60 * 60 * 2,
			);
			console.log('file:', {
				resultUrl,
				directory: dto.directory,
				parentId: dto.parentId,
				name: dto.filename,
				mimetype: dto.mimetype,
			});
			return {
				presignedUrl,
				uploadId,
			};
		} catch (e) {
			console.log('Error', e);
			throw e;
		}
	}

	public async finishUploadFile(dto: FinishFileUpload) {
		const _data = await this.redisService.get(dto.uploadId);
		if (!_data) throw new NotFoundException('Upload id invalid');

		const data = JSON.parse(_data);

		const payload: IStoreGalleryPayload = {
			fileUrl: data.resultUrl,
			parentId: data.parentId,
			fileName: data.name,
			parentTable: '',
			mimetype: data.mimetype,
		};

		switch (data.directory) {
			case 'job': {
				payload.parentTable = 'jobs';
				break;
			}
			case 'talentImages': {
				payload.parentTable = 'talents';
				payload.data = 'images';
				break;
			}
			case 'talentWorkImages': {
				payload.parentTable = 'talents';
				payload.data = 'work';
				break;
			}
			case 'projectsFile': {
				payload.parentTable = 'projects';
				break;
			}
			case 'employerCoverImage': {
				payload.parentTable = 'employers';
				payload.data = 'cover';
				break;
			}

			case 'jobsFile': {
				payload.parentTable = 'jobs';
				break;
			}
			case 'proccessEntities': {
				payload.parentTable = 'proccessEntities';
				break;
			}
			case 'certeficationFile': {
				payload.parentTable = 'certifications';
				break;
			}
		}

		if (payload.parentTable) await this.galleryService.store(payload);

		await this.redisService.del(dto.uploadId);
	}

	public async removeFiles(userId: number, dto: RemoveFilesParamsDto) {
		const items = await this.galleryRepository.findBy({ id: In(dto.ids) });

		await Promise.all(
			items.map(async it => {
				const canDelete = await this.filesStoreAccessService.checkAccessToRemove(userId, it);
				if (!canDelete) throw new ForbiddenException("Your don't have permission for this");

				await this.galleryService.delete(it.id);
			}),
		);
	}
}
