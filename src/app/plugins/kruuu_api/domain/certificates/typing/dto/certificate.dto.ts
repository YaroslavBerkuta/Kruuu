import { DtoProperty, DtoPropertyOptional, Term } from '~api/shared';

export class CertificateDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	title: string;

	@DtoProperty()
	startDate: string;

	@DtoProperty()
	durationTime?: string;

	@DtoProperty({ type: String, enum: Term })
	durationTerm?: Term;

	@DtoProperty()
	location: string;

	@DtoProperty()
	descriptions: string;

	@DtoProperty()
	userId: number;

	@DtoPropertyOptional()
	createdAt?: string;

	@DtoPropertyOptional()
	updatedAt?: string;
}

export class CertifyUserDto {
	@DtoProperty()
	id: number;

	@DtoProperty()
	certeficateId: number;

	@DtoProperty()
	userId: number;

	@DtoPropertyOptional()
	createdAt?: string;
}
