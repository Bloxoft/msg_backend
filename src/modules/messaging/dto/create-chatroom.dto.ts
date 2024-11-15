import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from "class-validator";
import { RoomType } from "../enums/type.lib";
import { ChatRoomSettings } from "../models/chatroom.model";

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

    @IsUrl()
    @IsOptional()
    roomLogo: string;

    @IsObject()
    @IsOptional()
    settings: ChatRoomSettings;

}
