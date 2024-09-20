import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOtpDto {
    @IsEmail()
    @IsNotEmpty()
    processId: string;

    @IsString()
    @IsNotEmpty()
    processType: string;

    @IsNumber()
    length?: number;
}
