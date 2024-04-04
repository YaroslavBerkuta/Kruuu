import { Inject, Injectable } from '@nestjs/common';
import { ITagsService, TAGS_SERVICE } from '~api/domain/tags/typing';
import { GetTagsListParamsDto, StoreTagPayloadDto } from '../dto';

@Injectable()
export class AppTagsService {
	@Inject(TAGS_SERVICE) private readonly tagsService: ITagsService;

	public async getTagsList(userId: number, dto: GetTagsListParamsDto) {
		const tags = await this.tagsService.getList({ ...dto, userId });
		return tags;
	}

	public async addTag(userId: number, dto: StoreTagPayloadDto) {
		return this.tagsService.store({
			...dto,
			authorId: userId,
			isCustom: true,
		});
	}
}
