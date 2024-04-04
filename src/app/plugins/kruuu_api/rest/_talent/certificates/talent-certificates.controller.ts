import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TalentCertificatesService } from './talent-certificates.service';
import { ReqUser } from '~api/shared';
import { AuthGuard } from '~api/domain/sessions/decorators';

@ApiTags('Talent | Certificates')
@Controller('talent/certificates')
export class TalentCertificatesController {
	constructor(private readonly talentCertificatesService: TalentCertificatesService) {}

	@AuthGuard()
	@Get('')
	myCertfificates(@ReqUser() userId: number) {
		return this.talentCertificatesService.myCertfificates(userId);
	}
}
