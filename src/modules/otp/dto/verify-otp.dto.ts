import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    processId: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}
