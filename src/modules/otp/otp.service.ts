import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOtpDto } from './dto/create-otp.dto';
import { generateSanitizedCode } from 'src/utils/generators';
import { Otp } from './models/otp.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Hasher } from 'src/utils/helpers';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class OtpService {
    constructor(
        @InjectModel(Otp.name) private otpModel: Model<Otp>
    ) { }

    async create(data: CreateOtpDto) {
        // Generate a new OTP code
        const generatedCode = String(generateSanitizedCode(data.length));
        // Hash the generated code for security
        const hashedCode = await new Hasher().hash(generatedCode);

        // Check if an OTP already exists for this processId
        let previousOTP = await this.otpModel.findOne({ processId: data.processId })
        if (previousOTP) {
            // If exists, delete the previous OTP
            await previousOTP.deleteOne();
            // Create a new OTP with the same processId
            await this.otpModel.create({
                processId: data.processId,
                code: hashedCode
            })
        } else {
            // If no previous OTP, create a new one
            await this.otpModel.create({
                processId: data.processId,
                code: hashedCode
            })
        }

        // Return the unhashed generated code
        return generatedCode;
    }

    async verifyOtp(data: VerifyOtpDto) {
        // Check if an OTP already exists for this processId
        let previousOTP = await this.otpModel.findOne({ processId: data.processId })

        if (!previousOTP) {
            throw new NotFoundException('Invalid OTP')
        }

        const checker = await new Hasher().verify(previousOTP.code, data.otp)
        if (checker === true) {
            await previousOTP.deleteOne()
        }
        return checker;
    }
}
