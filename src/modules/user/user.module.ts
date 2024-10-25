import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongoModels } from '../shared/mongo-models.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongoModels],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule { }
