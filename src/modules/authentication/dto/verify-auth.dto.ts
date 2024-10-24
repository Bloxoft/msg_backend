import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class VerifyAuthDto {
    @IsString()
    @IsNotEmpty()
    processId: string;

    @IsNumberString()
    @IsNotEmpty()
    code: string;
}
