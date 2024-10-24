import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongoModels } from '../shared/mongo-models.module';

@Module({
  imports: [MongoModels],
  controllers: [UserController],
  providers: [UserService,],
})
export class UserModule { }
