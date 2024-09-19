import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_STRING } from 'src/config/env.config';

@Module({
    imports: [
        MongooseModule.forRoot(DB_STRING)
    ]
})
export class DatabaseModule { }
