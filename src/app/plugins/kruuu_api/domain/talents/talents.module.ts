import { DynamicModule, Module } from '@nestjs/common';
import { provideEntity } from '~api/libs';
import { provideClass } from '~api/shared';
import { GalleryModule } from '../galleries/gallery.module';
import { SocialModule } from '../social/social.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { TalentEducation, TalentInfo, TalentLike, TalentSkill } from './entities';
import { TalentsService, TalentsSkillsService } from './services';
import { TalentsEducationService } from './services/talents-educations.service';
import {
	TALENTS_EDUCATION_REPOSITORY,
	TALENTS_INFO_REPOSITORY,
	TALENTS_INFO_SERVICE,
	TALENTS_SKILLS_REPOSITORY,
	TALENT_LIKE_REPOSITORY,
} from './typing';

@Module({})
export class TalentsModule {
	private static getProviders() {
		return [
			provideEntity(TALENTS_INFO_REPOSITORY, TalentInfo),
			provideEntity(TALENTS_SKILLS_REPOSITORY, TalentSkill),
			provideEntity(TALENTS_EDUCATION_REPOSITORY, TalentEducation),
			provideEntity(TALENT_LIKE_REPOSITORY, TalentLike),
			provideClass(TALENTS_INFO_SERVICE, TalentsService),
			TalentsSkillsService,
			TalentsEducationService,
		];
	}

	static getImports() {
		return [
			SocialModule.forFeature(),
			GalleryModule.forFeature(),
			TagsModule.forFeature(),
			UsersModule.forFeature(),
		];
	}

	static forRoot(): DynamicModule {
		return {
			module: TalentsModule,
			imports: TalentsModule.getImports(),
			providers: TalentsModule.getProviders(),
		};
	}

	static forFeature(): DynamicModule {
		return {
			module: TalentsModule,
			imports: TalentsModule.getImports(),
			exports: [
				TALENTS_INFO_REPOSITORY,
				TALENTS_SKILLS_REPOSITORY,
				TALENTS_INFO_SERVICE,
				TALENT_LIKE_REPOSITORY,
			],
			providers: TalentsModule.getProviders(),
		};
	}
}
