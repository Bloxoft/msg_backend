import { IsLocale, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsTimeZone, IsUrl } from "class-validator";
import { Types } from "mongoose";

export class CreateProfileDto {

    @IsString()
    userId: Types.ObjectId;

    @IsString()
    phoneNumberIntl: string;

    @IsLocale()
    locale: string;

    @IsTimeZone()
    timezone: string;

    @IsString()
    username: string;

    @IsString()
    countryCode: string;

    @IsString()
    currency: string;

    @IsUrl()
    avatarUrl: string;
}
