import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { MessageChannel } from "src/common/enums/channels.enum";

export class StartAuthDto {
    @IsString()
    @IsNotEmpty()
    phoneNumberIntl: string;

    @IsString()
    verificationChannel?: MessageChannel
}
