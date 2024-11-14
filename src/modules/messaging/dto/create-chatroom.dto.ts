import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoomType } from "../enums/type.lib";

export class CreateChatroomDto {
    @IsArray()
    @IsNotEmpty()
    members: string[];

    @IsString()
    @IsOptional()
    type: RoomType;

    @IsString()
    @IsOptional()
    roomName: string;

    @IsString()
    @IsOptional()
    roomDescription: string;

}
