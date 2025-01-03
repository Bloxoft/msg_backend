import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { MongoModels } from '../shared/mongo-models.module';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Microservices } from '../shared/microservice.module';

@Module({
  imports: [MongoModels, Microservices],
  controllers: [MessagingController],
  providers: [MessagingService, UserService, JwtService],
})
export class MessagingModule { }
