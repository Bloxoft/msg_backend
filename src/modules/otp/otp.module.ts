import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MongoModels } from '../shared/mongo-models.module';

@Module({
  imports: [MongoModels],
  providers: [OtpService],
})
export class OtpModule { }
