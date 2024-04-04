import { DynamicModule, Module } from '@nestjs/common';
import { InstituteTalentsController } from './institute-talents.controller';
import { InstituteTalentsService } from './institute-talents.service';
import { TagsModule, TalentsModule } from '~api/domain';
import { GalleryModule } from '~api/domain/galleries/gallery.module';

@Module({})
export class InstituteTalentsModule {
	static forRoot(): DynamicModule {
		return {
			module: InstituteTalentsModule,
			controllers: [InstituteTalentsController],
			providers: [InstituteTalentsService],
			imports: [TalentsModule.forFeature(), TagsModule.forFeature(), GalleryModule.forFeature()],
		};
	}
}
