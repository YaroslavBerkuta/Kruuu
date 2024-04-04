import { DtoProperty } from '~api/shared';

export class GetUserCertificatesParamsDto {
	@DtoProperty()
	targetUserId: number;
}
