import { DtoProperty, DtoPropertyOptional } from '~api/shared';

export class TransactionDto {
	@DtoProperty()
	merchantCode: string;

	@DtoProperty()
	reference: string;

	@DtoProperty()
	paymentUrl: string;

	@DtoPropertyOptional()
	vaNumber?: string;

	@DtoPropertyOptional()
	qrString?: string;

	@DtoPropertyOptional()
	amount?: string;

	@DtoProperty()
	statusCode: string;

	@DtoProperty()
	statusMessage: string;
}
