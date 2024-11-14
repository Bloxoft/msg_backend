import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './models/chatroom.model';
import { Model } from 'mongoose';
import { Message } from './models/message.model';
import { _ } from 'src/constant/variables.static';
import { RoomType } from './enums/type.lib';
import { Encryptor } from 'src/utils/helpers';

@Injectable()
export class MessagingService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(ChatRoom.name) private chatroomModel: Model<ChatRoom>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) { }

  async createChatroom(data: CreateChatroomDto, userId: string) {
    const membersList = _.concat(data.members, userId);
    const findExistingRoom = await this.chatroomModel.findOne({ members: membersList })
    if (data.type == RoomType.P2P) {
      if (findExistingRoom) {
        throw new HttpException('Chatroom already exists', HttpStatus.CONFLICT)
      }
    }
    const roomEncryptionKey = new Encryptor().encryptor(new Encryptor().createEncryptionKey()).toString()

    const saveChatroom = await this.chatroomModel.create({
      ...data,
      members: membersList,
      encryptionSecretKey: roomEncryptionKey,
      creatorUserId: userId
    })

    return { message: 'Chatroom successfully created!', data: saveChatroom };
  }

  async findAllChatrooms(userId: string) {
    const allUsersRooms = await this.chatroomModel.find({ members: { $elemMatch: { $eq: userId } } })
    return { message: 'Chatroom successfully fetched!', data: allUsersRooms };
  }

  async findChatroomById(roomId: string) {
    const getChatroom = await this.chatroomModel.findById(roomId)
    return { message: 'Chatroom fetched!', data: getChatroom };
  }

  async deleteChatrooom(roomId: string) {
    const deleteChatroom = await this.chatroomModel.findByIdAndDelete(roomId)
    return { message: 'Chatroom deleted!', data: deleteChatroom };
  }
}
