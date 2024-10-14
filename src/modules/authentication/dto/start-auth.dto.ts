import { IsNotEmpty, IsObject, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { MessageChannel } from "src/common/enums/channels.enum";

export class StartAuthDto {
    @IsString()
    @IsNotEmpty()
    phoneNumberIntl: string;

    @IsString()
    @IsOptional()
    verificationChannel: MessageChannel

    @IsObject()
    @IsOptional()
    metadata: Object
}
