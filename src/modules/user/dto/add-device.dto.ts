import { IsDateString, IsObject, IsOptional, IsString } from "class-validator";
import { DevicePlatformType } from "../enums/type.lib";

export class AddDeviceDto {
    @IsString()
    platform: DevicePlatformType

    @IsString()
    deviceName: string

    @IsString()
    @IsOptional()
    serialNumber: string

    @IsString()
    deviceId: string

    @IsString()
    @IsOptional()
    deviceFcmToken: string

    @IsString()
    @IsOptional()
    loginTimestamp: Date

    @IsObject()
    metadata: Object

    @IsObject()
    uniqueData: Object

}
