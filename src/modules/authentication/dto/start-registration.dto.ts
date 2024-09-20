import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class StartRegistrationAuthDto {
    @IsString()
    @IsNotEmpty()
    phoneNumberIntl: string;
}
