import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { generateId } from 'src/utils/generators';
import { UploadMediaService } from 'src/services/index.service';

@Controller('utility')
export class UtilityController {
  constructor(
    private readonly utilityService: UtilityService,
    private readonly uploadMediaService: UploadMediaService // Inject UploadMediaService
  ) { }

  @Post('upload-media')
  @UseInterceptors(AnyFilesInterceptor())
  async upload(
    @Body() body: { data: string },
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const parsedData = JSON.parse(body.data);
    return await this.uploadMediaService.uploadMedia(
      files,
      generateId(),
      parsedData.description,
      parsedData.addWatermark ?? true
    );
  }
}
