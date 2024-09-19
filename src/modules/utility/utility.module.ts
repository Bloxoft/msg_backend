import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { UtilityController } from './utility.controller';
import { UploadMediaService } from 'src/services/index.service';

@Module({
  controllers: [UtilityController],
  providers: [UtilityService, UploadMediaService],
})
export class UtilityModule { }
