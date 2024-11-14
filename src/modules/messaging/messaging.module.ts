import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { MongoModels } from '../shared/mongo-models.module';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongoModels],
  controllers: [MessagingController],
  providers: [MessagingService, UserService, JwtService],
})
export class MessagingModule { }
