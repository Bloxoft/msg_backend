import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './models/chatroom.model';
import { Model } from 'mongoose';
import { Message } from './models/message.model';
import { _ } from 'src/constant/variables.static';
import { RoomType } from './enums/type.lib';
import { Encryptor } from 'src/utils/helpers';
import { CreateMessageDto } from './dto/create-message.dto';
import { Profile } from '../user/models/profile.model';
import { v4 as uuidv4 } from 'uuid';
import { logger } from 'src/common/helpers/logger.lib';


@Injectable()
export class MessagingService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(ChatRoom.name) private chatroomModel: Model<ChatRoom>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) { }

  // chatroom services
  async createChatroom(data: CreateChatroomDto, userId: string) {
    const membersList = _.uniq(_.concat(data.members, userId));
    const encryptorClass = new Encryptor();
    const mainKey = uuidv4();
    const roomEncryptionKey = encryptorClass.encryptor(mainKey)

    const findExistingRoom = await this.chatroomModel.findOne({ members: membersList })
    if (data.type == RoomType.P2P) {
      if (findExistingRoom) {
        throw new HttpException('Chatroom already exists', HttpStatus.CONFLICT)
      }
    }

    const saveChatroom = await this.chatroomModel.create({
      ...data,
      members: membersList,
      encryptionSecretKey: roomEncryptionKey,
      creatorUserId: userId
    })

    return { message: 'Chatroom successfully created!', data: saveChatroom };
  }

  async findAllChatrooms(userId: string) {
    const allUserRooms = await this.chatroomModel.find({ members: { $elemMatch: { $eq: userId } } })

    const chatroomsData = await Promise.all(allUserRooms.map(async (room) => {
      const encryptorClass = new Encryptor();
      const roomEncryptionKey = encryptorClass.decrypt(room.encryptionSecretKey)

      let otherMemberProfile: Profile;
      if (room.type === RoomType.P2P) {
        otherMemberProfile = await this.userService.findOneProfile({ userId: userId })
      }
      const fetchLastMessage = await this.messageModel.findOne({ chatroomId: room._id }).sort('-created_at');

      const unreadMsgCount = await this.messageModel.countDocuments({ readBy: { $elemMatch: { $ne: userId } }, chatroomId: room._id, authorId: { $ne: userId } })
      return {
        ...room.toObject(),
        encryptionSecretKey: roomEncryptionKey,
        metadata: {
          otherMember: otherMemberProfile,
          lastMessage: fetchLastMessage,
          roomName: room.roomName,
          roomDescription: room.roomDescription,
          roomLogo: room.roomLogo,
          unreadMessagesCount: unreadMsgCount,
        }
      }
    }));

    return {
      message: 'Chatroom successfully fetched!',
      data: chatroomsData
    };
  }

  async findChatroomById(roomId: string) {
    const getChatroom = await this.chatroomModel.findById(roomId)
    if (!getChatroom) {
      throw new NotFoundException('Chatroom not found')
    }
    const encryptorClass = new Encryptor();
    const roomEncryptionKey = encryptorClass.decrypt(getChatroom.encryptionSecretKey)

    let otherMemberProfile: Profile;
    if (getChatroom.type === RoomType.P2P) {
      otherMemberProfile = await this.userService.findOneProfile({ userId: getChatroom.creatorUserId })
    }
    const fetchLastMessage = await this.messageModel.findOne({ chatroomId: getChatroom._id }).sort('-created_at');
    const unreadMsgCount = await this.messageModel.countDocuments({ readBy: { $elemMatch: { $ne: getChatroom.creatorUserId } }, chatroomId: getChatroom._id, authorId: { $ne: getChatroom.creatorUserId } })
    return {
      message: 'Chatroom fetched!', data: {
        ...getChatroom.toObject(),
        encryptionSecretKey: roomEncryptionKey,
        metadata: {
          otherMember: otherMemberProfile,
          lastMessage: fetchLastMessage,
          roomName: getChatroom.roomName,
          roomDescription: getChatroom.roomDescription,
          roomLogo: getChatroom.roomLogo,
          unreadMessagesCount: unreadMsgCount,
        }
      }
    };
  }

  async deleteChatrooom(roomId: string) {
    const deleteChatroom = await this.chatroomModel.findByIdAndDelete(roomId)
    return { message: 'Chatroom deleted!', data: deleteChatroom };
  }


  // messages services
  async createMessage(data: CreateMessageDto, userId: string) {
    const getChatroom = await this.chatroomModel.findById(data.chatroomId)
    if (!getChatroom) {
      throw new NotFoundException('Chatroom not found!')
    }
    if (getChatroom.members.map(member => member.toString()).includes(userId) == false) {
      throw new UnauthorizedException('Not a member of chatroom')
    }

    const encryptorClass = new Encryptor();
    const roomEncryptionKey = encryptorClass.decrypt(getChatroom.encryptionSecretKey)

    const formattedMessage = {
      ...data.message,
      text: (data.message.text != null && data.message.text.length > 0) ? encryptorClass.encryptor(data.message.text.toString(), roomEncryptionKey) : '',
      media: data.message.media != null ? {
        ...data.message.media,
        mediaUrl: encryptorClass.encryptor(data.message.media.mediaUrl.toString(), roomEncryptionKey),
      } : null
    }

    const saveMessage = await this.messageModel.create({
      ...data,
      authorId: userId,
      message: formattedMessage
    })

    return { message: 'Message successfully created!', data: saveMessage };
  }

  async findAllMessages(userId: string, roomId: string) {
    const allUserMessages = await this.messageModel.find({ chatroomId: roomId, authorId: userId })
    return { message: 'Message successfully fetched!', data: allUserMessages };
  }

  async findMessageById(messageId: string) {
    const getMsg = await this.messageModel.findById(messageId)
    return { message: 'Message fetched!', data: getMsg };
  }

  async deleteMessage(roomId: string) {
    const deleteChatroom = await this.chatroomModel.findByIdAndDelete(roomId)
    return { message: 'Chatroom deleted!', data: deleteChatroom };
  }
}
