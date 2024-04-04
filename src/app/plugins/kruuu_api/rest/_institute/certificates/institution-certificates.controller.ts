import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InstituteCertificatesService } from './institution-certificates.service';
import { ApiImplictPagination, IPagination, ReqPagination, ReqUser } from '~api/shared';
import { UserRole } from '~api/domain/users/typing';
import { RoleGuard } from '~api/domain/sessions/decorators';
import {
	CerteficationListDto,
	CertifyUserPayloadDto,
	SaveCerteficatDto,
	SaveCerteficateResponceDto,
} from './dto';

@ApiTags('Institution | Certeficates')
@Controller('institution/certeficates')
export class InstituteCertificatesController {
	constructor(private readonly certeficationService: InstituteCertificatesService) {}

	@ApiOperation({ summary: 'Store institution certeficate' })
	@ApiResponse({
		status: 201,
		description: 'return certeficate object',
		type: SaveCerteficateResponceDto,
	})
	@ApiBody({ type: SaveCerteficatDto })
	@RoleGuard(UserRole.Institut)
	@Post()
	storeCerteficate(@ReqUser() userId: number, @Body() dto: SaveCerteficatDto) {
		return this.certeficationService.storeCerteficate(userId, dto);
	}

	@ApiOperation({ summary: 'Certefications list' })
	@ApiResponse({
		status: 201,
		description: 'return certeficate list width pagination',
		type: CerteficationListDto,
	})
	@ApiImplictPagination()
	@RoleGuard(UserRole.Institut)
	@Get()
	getList(@ReqUser() userId: number, @ReqPagination() pagination: IPagination) {
		return this.certeficationService.getList(userId, pagination);
	}

	@ApiOperation({ summary: 'Certify user' })
	@ApiResponse({
		status: 201,
	})
	@ApiBody({ type: CertifyUserPayloadDto })
	@RoleGuard(UserRole.Institut)
	@Put('certify')
	certifyUser(@Body() dto: CertifyUserPayloadDto, @ReqUser() userId: number) {
		return this.certeficationService.certifyUser(userId, dto);
	}

	@RoleGuard(UserRole.Institut)
	@Get('certify-users')
	getCertifyUsers(
		@ReqUser() userId: number,
		@ReqPagination() pagination: IPagination,
		@Query('certeficateId') certeficateId: number,
	) {
		return this.certeficationService.getCertifyUsers(userId, pagination, certeficateId);
	}
}
