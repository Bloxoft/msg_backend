import { Injectable } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';

@Injectable()
export class OtpService {
    async create(data: CreateOtpDto) {
        console.log('hello')
    }
}
