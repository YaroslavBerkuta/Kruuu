import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { TagDto } from '~api/domain/tags/typing';
import { ReqUser } from '~api/shared';
import { GetTagsListParamsDto, StoreTagPayloadDto } from '../dto';
import { AppTagsService } from '../services';

@ApiTags('App | Tags')
@Controller('app/tags')
export class AppTagsController {
	constructor(private readonly appTagsService: AppTagsService) {}

	@ApiOperation({ summary: 'Add new tag' })
	@ApiBody({ type: StoreTagPayloadDto })
	@ApiResponse({
		status: 201,
		description:
			'Create and return new tag. If tag with passed name and category exists, return existing tag',
		type: TagDto,
	})
	@ApiBadRequestResponse({
		description: 'Parent not found',
	})
	@AuthGuard()
	@Post()
	public async addTag(@ReqUser() userId: number, @Body() dto: StoreTagPayloadDto) {
		return await this.appTagsService.addTag(userId, dto);
	}

	@ApiOperation({ summary: 'Get all tags (with user custom)' })
	@ApiOkResponse({
		description: 'Return all default tags and current user custom tags',
		isArray: true,
		type: TagDto,
	})
	@AuthGuard()
	@Get()
	public async getTagsList(@ReqUser() userId: number, @Query() dto: GetTagsListParamsDto) {
		return await this.appTagsService.getTagsList(userId, dto);
	}
}
