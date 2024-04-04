import { Inject, Injectable } from '@nestjs/common';
import {
	ISocialLinksService,
	SocialLinkDto,
	SOCIAL_LINKS_SERVICE,
} from '~api/domain/social/typing';
import { ITagsService, TagDto, TAGS_SERVICE } from '~api/domain/tags/typing';
import { ITalentInfo, ITalentsService, TALENTS_INFO_SERVICE } from '~api/domain/talents/typing';
import {
	SaveTalentEducationPayloadDto,
	SaveTalentInfoPayloadDto,
	SaveTalentSkillsPayloadDto,
	SaveTalentSocialMediaPayloadDto,
	UpdateTalentInfoPayloadDto,
} from '../dto';
import * as _ from 'lodash';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TalentAccountService {
	@Inject(TALENTS_INFO_SERVICE) private readonly talentsInfoService: ITalentsService;
	@Inject(TAGS_SERVICE) private readonly tagsService: ITagsService;
	@Inject(SOCIAL_LINKS_SERVICE)
	private readonly socialLinksService: ISocialLinksService;

	public async saveBaseInfo(userId: number, dto: SaveTalentInfoPayloadDto) {
		return this.talentsInfoService.saveInfo(userId, dto);
	}

	public async updateTalentInfo(userId: number, dto: UpdateTalentInfoPayloadDto) {
		return this.talentsInfoService.updateInfo(userId, dto);
	}

	public async saveSocialMedia(userId: number, dto: SaveTalentSocialMediaPayloadDto) {
		await this.talentsInfoService.saveSocialMedia(userId, dto);
	}

	public async saveTalentSkills(userId: number, dto: SaveTalentSkillsPayloadDto) {
		await this.talentsInfoService.saveSkills(userId, dto);
	}

	public async saveTalentEducations(userId: number, { educations }: SaveTalentEducationPayloadDto) {
		await this.talentsInfoService.saveEducations(userId, educations);
	}

	public async getDetails(userId: number) {
		const talent = await this.talentsInfoService.getOneWithRelations(userId);
		if (!talent) return null;

		return this.prepareDetails(talent);
	}

	private async prepareDetails(talent: ITalentInfo) {
		const tagIds = [talent.mainOccupTagId, talent.secondOccupTagId].filter(it => !_.isNil(it));
		if (!_.isEmpty(talent.skills)) {
			const skillTagIds = [];
			talent.skills.map(it => skillTagIds.push(it.skillTagId));
			talent.skillTagIds = skillTagIds;
			tagIds.push(...skillTagIds);
		}

		const tags = await this.tagsService.getByIds(_.uniq(tagIds));
		talent.tags = plainToInstance(TagDto, tags);

		const socialMedia = await this.socialLinksService.get({
			parentType: 'talent',
			parentId: talent.userId,
		});
		talent.socialMedia = plainToInstance(SocialLinkDto, socialMedia);

		return talent;
	}
}
