import { IsArray, IsString } from "class-validator";

export class SaveUserLastSessionDto {
    @IsString()
    deviceId: string

    @IsString()
    timestamp: Date
}
