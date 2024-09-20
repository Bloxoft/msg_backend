import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { Microservices } from '../shared/microservice.module';

@Module({
  imports: [Microservices],
  providers: [OtpService],
})
export class OtpModule { }
