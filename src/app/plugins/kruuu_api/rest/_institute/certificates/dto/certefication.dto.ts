import { GalleryDto } from '~api/domain/galleries/dto';
import { CertificateDto } from '~api/domain/certificates/typing/dto';
import { DtoProperty } from '~api/shared';

export class CerteficatFilesDto extends CertificateDto {
	@DtoProperty({ isArray: true, type: GalleryDto })
	files: GalleryDto[];
}

export class CerteficationListDto {
	@DtoProperty({ isArray: true, type: CerteficatFilesDto })
	items: CerteficatFilesDto[];

	@DtoProperty()
	count: number;
}

export class CertifyUserDto {
	@DtoProperty()
	userId: number;

	@DtoProperty()
	certeficateId: number;
}
