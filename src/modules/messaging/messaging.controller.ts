import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { AuthGuard } from '../authentication/authentication.guard';
import { CreateMessageDto, CreateMessageDtoMessageData } from './dto/create-message.dto';

@UseGuards(AuthGuard)
@Controller('messaging-service')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) { }

  // chatroom service

  @Post('chatroom')
  createRoom(@Body() data: CreateChatroomDto, @Request() req) {
    return this.messagingService.createChatroom(data, req.user);
  }

  @Get('chatroom')
  findAllRooms(@Request() req) {
    return this.messagingService.findAllChatrooms(req.user);
  }

  @Get('chatroom/:roomId')
  findRoomById(@Param('roomId') id: string) {
    return this.messagingService.findChatroomById(id);
  }

  @Delete('chatroom/:roomId')
  deleteRoomById(@Param('roomId') id: string) {
    return this.messagingService.deleteChatrooom(id)
  }

  @Get('chatroom/messages/:roomId')
  findAllChatroomMessages(@Request() req, @Param('roomId') id: string) {
    return this.messagingService.findAllChatroomMessages(req.user, id);
  }

  // messaging service
  @Post('message')
  createMessage(@Body() data: CreateMessageDtoMessageData, @Request() req) {
    return this.messagingService.createMessage(data, req.user);
  }

  // @Get('messages')
  // findAllMessages(@Request() req) {
  //   return this.messagingService.findAllUserMessages(req.user);
  // }

  @Get('message/:id')
  findMessageById(@Param('id') id: string) {
    return this.messagingService.findMessageById(id);
  }
}
