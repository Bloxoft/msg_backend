import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { Microservices } from '../shared/microservice.module';
import { MongoModels } from '../shared/mongo-models.module';
import { ProcessService } from '../processes/process.service';
import { OtpService } from '../otp/otp.service';

@Module({
  imports: [Microservices, MongoModels],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, ProcessService, OtpService],
})
export class AuthenticationModule { }
