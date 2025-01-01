import { IsArray, IsString } from "class-validator";

export class RemoveMultipleDevicesDto {
    @IsArray()
    devices: Array<string>
}
