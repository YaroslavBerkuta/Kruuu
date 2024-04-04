import { CertificateDto } from '~api/domain/certificates/typing/dto';
import { DtoProperty, Term } from '~api/shared';

export class SaveCerteficatDto {
	@DtoProperty()
	title: string;

	@DtoProperty()
	startDate: string;

	@DtoProperty()
	durationTime: string;

	@DtoProperty({ type: String, enum: Term })
	durationTerm: Term;

	@DtoProperty()
	location: string;

	@DtoProperty()
	descriptions: string;
}

export class SaveCerteficateResponceDto extends CertificateDto {}

export class CertifyUserPayloadDto {
	@DtoProperty()
	userId: number;

	@DtoProperty()
	certeficateId: number;
}
