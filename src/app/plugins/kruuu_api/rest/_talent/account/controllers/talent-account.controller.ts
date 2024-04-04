import { Body, Controller, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { TalentAccountDto, TalentDto, TalentPlainDto } from '~api/domain/talents/typing';
import { ReqUser } from '~api/shared';
import {
	SaveTalentEducationPayloadDto,
	SaveTalentInfoPayloadDto,
	SaveTalentSkillsPayloadDto,
	SaveTalentSocialMediaPayloadDto,
	UpdateTalentInfoPayloadDto,
} from '../dto';
import { TalentAccountService } from '../services';

@ApiTags('Talent | Account')
@Controller('talent/account')
export class TalentAccountController {
	constructor(private readonly accountService: TalentAccountService) {}

	@ApiOperation({ summary: 'Talent base info (name, occupations, representative)' })
	@ApiBody({ type: SaveTalentInfoPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Create and return talent info with base info',
		type: TalentDto,
	})
	@AuthGuard()
	@Post('info')
	public async saveInfo(@ReqUser() userId: number, @Body() dto: SaveTalentInfoPayloadDto) {
		return await this.accountService.saveBaseInfo(userId, dto);
	}

	@ApiOperation({ summary: 'Update talent info' })
	@ApiBody({ type: UpdateTalentInfoPayloadDto })
	@ApiOkResponse({
		description: 'Update and return talent info (create if not exist)',
		type: TalentDto,
	})
	@AuthGuard()
	@Patch('info')
	public async updateInfo(@ReqUser() userId: number, @Body() dto: UpdateTalentInfoPayloadDto) {
		return await this.accountService.updateTalentInfo(userId, dto);
	}

	@ApiOperation({ summary: 'Save/update talent social media' })
	@ApiBody({ type: SaveTalentSocialMediaPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Save/update talent social media',
	})
	@AuthGuard()
	@Post('social-media')
	public async saveSocialMedia(
		@ReqUser() userId: number,
		@Body() dto: SaveTalentSocialMediaPayloadDto,
	) {
		return await this.accountService.saveSocialMedia(userId, dto);
	}

	@ApiOperation({ summary: 'Save/update talent skills' })
	@ApiBody({ type: SaveTalentSkillsPayloadDto })
	@ApiResponse({
		status: 201,
		description: 'Save/update talent skills',
	})
	@AuthGuard()
	@Post('skills')
	public async saveSkills(@ReqUser() userId: number, @Body() dto: SaveTalentSkillsPayloadDto) {
		return await this.accountService.saveTalentSkills(userId, dto);
	}

	@AuthGuard()
	@Put('education')
	public saveEducation(@ReqUser() userId: number, @Body() dto: SaveTalentEducationPayloadDto) {
		return this.accountService.saveTalentEducations(userId, dto);
	}

	@ApiOperation({ summary: 'Get talent details' })
	@ApiOkResponse({
		description: 'Return talent details if they exist',
		type: TalentAccountDto,
	})
	@AuthGuard()
	@Get()
	public async getTalent(@ReqUser() userId: number) {
		const account = await this.accountService.getDetails(userId);
		return plainToClass(TalentPlainDto, account);
	}
}
