import { IsLocale, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, IsString, IsTimeZone, IsUrl } from "class-validator";

export class FinishAuthDto {
    @IsString()
    processId: string;

    @IsString()
    type: string;

    @IsString()
    @IsOptional()
    phoneNumberIntl: string;

    @IsLocale()
    @IsOptional()
    locale: string;

    @IsTimeZone()
    @IsOptional()
    timezone: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    countryCode: string;

    @IsString()
    @IsOptional()
    currency: string;

    @IsUrl()
    @IsOptional()
    avatarUrl: string;
}
