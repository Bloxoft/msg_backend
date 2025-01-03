import { MessageType } from '../enums/type.lib';
import { EmojiReactionSchema, MSGDeleteSchema, MSGSchema } from './../models/message.model';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from "class-validator";


export class CreateMessageDtoMessageData {
    @IsString()
    @IsNotEmpty()
    chatroomId: string;

    @IsString()
    @IsOptional()
    type: MessageType;

    @IsObject()
    @IsNotEmpty()
    message: MSGSchema;

    @IsArray()
    @IsOptional()
    deletes: MSGDeleteSchema[];

    @IsArray()
    @IsOptional()
    roomsForwardedTo: string[];

    @IsUrl()
    @IsOptional()
    roomLogo: string;

    @IsArray()
    @IsOptional()
    readBy: string[];

    @IsArray()
    @IsOptional()
    reactions: EmojiReactionSchema[];

    @IsString()
    @IsOptional()
    replyMessage: string;

    @IsString()
    @IsOptional()
    replyMessageText: string;
}

export class CreateMessageDto {
    @IsString()
    @IsOptional()
    senderDeviceId?: string;

    @IsObject()
    messageData: CreateMessageDtoMessageData;
}