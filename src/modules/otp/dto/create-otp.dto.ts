import { IsString, IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOtpDto {
    @IsString()
    @IsNotEmpty()
    processId: string;

    @IsNumber()
    length?: number;
}
