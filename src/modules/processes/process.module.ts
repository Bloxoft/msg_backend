import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { MongoModels } from '../shared/mongo-models.module';


@Module({
  imports: [MongoModels],
  providers: [ProcessService],
})
export class ProcessModule { }
