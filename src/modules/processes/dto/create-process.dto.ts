import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProcessDto {
    @IsString()
    @IsNotEmpty()
    phoneId: string;

    @IsString()
    @IsNotEmpty()
    type: string;

}