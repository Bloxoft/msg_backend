import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class StartAuthDto {
    @IsString()
    @IsNotEmpty()
    phoneNumberIntl: string;
}
