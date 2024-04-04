import { Inject, Injectable } from '@nestjs/common';
import { Seeder } from '~api/shared';
import { ITagsService } from '../typing';
import { TAGS_SEED_ENTITIES, TAGS_SERVICE } from '../typing/consts';

@Injectable()
export class TagsSeeder extends Seeder {
	@Inject(TAGS_SERVICE) private tagsService: ITagsService;

	protected name = 'Tags seeder';

	protected async seed(): Promise<void> {
		await Promise.all(
			TAGS_SEED_ENTITIES.map(async tag => {
				await this.tagsService.store(tag);
			}),
		);
	}
}
