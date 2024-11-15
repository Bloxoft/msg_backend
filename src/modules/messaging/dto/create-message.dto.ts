import { EmojiReactionSchema, Message, MSGDeleteSchema, MSGSchema } from './../models/message.model';
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    chatroomId: string;

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
