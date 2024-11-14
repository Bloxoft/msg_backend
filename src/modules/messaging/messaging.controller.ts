import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { AuthGuard } from '../authentication/authentication.guard';

@UseGuards(AuthGuard)
@Controller('messaging-service')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) { }

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
}
