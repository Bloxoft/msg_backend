import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Process } from './models/process.model';
import { Model } from 'mongoose';
import { CreateProcessDto } from './dto/create-process.dto';

@Injectable()
export class ProcessService {
    constructor(
        @InjectModel(Process.name) private process: Model<Process>
    ) { }

    async create(data: CreateProcessDto) {
        const previousProcess = await this.process.findOne(data)

        if (previousProcess) {
            return previousProcess
        } else {
            return await this.process.create(data)
        }
    }
}
