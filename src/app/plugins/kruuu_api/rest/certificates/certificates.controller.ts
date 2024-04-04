import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RestCertificatesService } from './certificates.service';

import { GetUserCertificatesParamsDto } from './dto';
import { AuthGuard } from '~api/domain/sessions/decorators';

@ApiTags('Common | Certificates')
@Controller('/certificates')
export class RestCertificatesController {
	constructor(private readonly restCertificatesService: RestCertificatesService) {}

	@AuthGuard()
	@Get('/by-user')
	myCertfificates(@Query() dto: GetUserCertificatesParamsDto) {
		return this.restCertificatesService.getUserCertificates(dto.targetUserId);
	}
}
