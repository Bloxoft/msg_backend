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

        if (previousProcess && !previousProcess.completed) {
            return previousProcess
        } else {
            return await this.process.create(data)
        }
    }

    async complete(id: String) {
        const existingProcess = await this.process.findByIdAndUpdate(id, {
            completed: true
        })

        return existingProcess;
    }

    async findById(id: String) {
        return await this.process.findById(id)

    }

    async remove(id: String) {
        return await this.process.findByIdAndDelete(id)

    }

    async status(id: String) {
        const existingProcess = await this.process.findById(id)
        if (existingProcess) {
            return existingProcess.completed;
        } else {
            return null;
        }
    }
}
