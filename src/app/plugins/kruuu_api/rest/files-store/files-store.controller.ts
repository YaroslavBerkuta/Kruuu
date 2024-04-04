import { Body, Controller, Delete, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '~api/domain/sessions/decorators';
import { ReqUser } from '~api/shared';
import { FinishFileUpload, RemoveFilesParamsDto, StoreFileDto, StoreFileResDto } from './dto';
import { FilesStoreService } from './files-store.service';

@ApiTags('File-Store')
@Controller('file-store')
export class FilesStoreController {
	constructor(private readonly fileStoreService: FilesStoreService) {}

	@ApiOperation({ summary: 'Store file' })
	@ApiBody({ type: StoreFileDto })
	@ApiResponse({
		status: 201,
		description: 'store file in bucket',
		type: StoreFileResDto,
	})
	@AuthGuard()
	@Put('start-upload-file')
	public create(@ReqUser() id: number, @Body() dto: StoreFileDto) {
		return this.fileStoreService.getLinkToUploadFile(id, dto);
	}

	@AuthGuard()
	@Put('finish-upload-file')
	public async finishUploadFile(@Body() dto: FinishFileUpload) {
		return this.fileStoreService.finishUploadFile(dto);
	}

	@AuthGuard()
	@Delete()
	public async delete(@ReqUser() id: number, @Query() dto: RemoveFilesParamsDto) {
		return this.fileStoreService.removeFiles(id, dto);
	}
}
