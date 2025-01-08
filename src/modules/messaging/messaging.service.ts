import { NotificationFromMessageFormatter } from './functions/createNotificationsFromMessage.fx';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from './models/chatroom.model';
import { Model } from 'mongoose';
import { Message } from './models/message.model';
import { _ } from 'src/constant/variables.static';
import { RoomType } from './enums/type.lib';
import { Encryptor } from 'src/utils/helpers';
import { CreateMessageDto, CreateMessageDtoMessageData } from './dto/create-message.dto';
import { Profile } from '../user/models/profile.model';
import { v4 as uuidv4 } from 'uuid';
import { logger } from 'src/common/helpers/logger.lib';
import { MicroservicesName } from 'src/common/enums/microservices.enum';
import { ClientProxy } from '@nestjs/microservices';
import { NotifierSingleChannelMessageEvent } from 'src/common/events/notifier_service.event';
import { MessageChannel } from 'src/common/enums/channels.enum';
import { Device } from '../user/models/device.model';


@Injectable()
export class MessagingService {
  constructor(
    @Inject(MicroservicesName.NOTIFIER) private notifier: ClientProxy,
    @InjectModel(ChatRoom.name) private chatroomModel: Model<ChatRoom>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    private readonly userService: UserService,
  ) { }

  // chatroom services
  async createChatroom(data: CreateChatroomDto, userId: string) {
    const membersList = _.uniq(_.concat(data.members, userId));
    if (membersList.length == 1) {
      membersList.push(membersList[0])
    }
    const encryptorClass = new Encryptor();
    const mainKey = uuidv4();
    const roomEncryptionKey = encryptorClass.encryptor(mainKey)

    const findExistingRoom = await this.chatroomModel.findOne({ members: { $eq: membersList.sort() } })

    let otherMemberProfile: Profile;
    if (data.type == RoomType.P2P) {
      const otherMemberUserId = membersList.filter((member: string) => {
        return member != userId.toString();
      })

      if (otherMemberUserId.length === 0) {
        otherMemberUserId[0] = userId;
      }

      otherMemberProfile = await this.userService.findOneProfile({ userId: otherMemberUserId[0] })
      if (findExistingRoom) {
        return {
          message: 'Chatroom already exists!', data: {
            ...findExistingRoom.toObject(),
            encryptionSecretKey: mainKey,
            metadata: {
              otherMember: otherMemberProfile,
              roomName: findExistingRoom.roomName,
              roomDescription: findExistingRoom.roomDescription,
              roomLogo: findExistingRoom.roomLogo,
            }
          }
        };
      }
    }

    const saveChatroom = await this.chatroomModel.create({
      ...data,
      members: membersList.sort(),
      encryptionSecretKey: roomEncryptionKey,
      creatorUserId: userId,

    })

    return {
      message: 'Chatroom successfully created!', data: {
        ...saveChatroom.toObject(),
        encryptionSecretKey: mainKey,
        metadata: {
          otherMember: otherMemberProfile,
          roomName: saveChatroom.roomName,
          roomDescription: saveChatroom.roomDescription,
          roomLogo: saveChatroom.roomLogo,
        }
      }
    };
  }

  async findAllChatrooms(userId: string) {
    const allUserRooms = await this.chatroomModel.find({ members: { $elemMatch: { $eq: userId } } })


    const chatroomsData = await Promise.all(allUserRooms.map(async (room) => {
      const encryptorClass = new Encryptor();
      const roomEncryptionKey = encryptorClass.decrypt(room.encryptionSecretKey)

      const allMembers: string[] = JSON.parse(JSON.stringify(room.members))

      let otherMemberProfile: Profile;
      if (room.type === RoomType.P2P) {
        const otherMemberUserId = allMembers.filter((member: string) => {
          return member != userId.toString();
        })

        if (otherMemberUserId.length === 0) {
          otherMemberUserId[0] = userId;
        }

        otherMemberProfile = await this.userService.findOneProfile({ userId: otherMemberUserId[0] })
      }
      const fetchLastMessage = await this.messageModel.findOne({ chatroomId: room._id }).sort({ createdAt: -1 });

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

    const allMembers = JSON.parse(JSON.stringify(getChatroom.members))

    let otherMemberProfile: Profile;
    if (getChatroom.type === RoomType.P2P) {
      const otherMemberUserId = allMembers.filter((member: string) => {
        return member != getChatroom.creatorUserId.toString();
      })
      otherMemberProfile = await this.userService.findOneProfile({ userId: otherMemberUserId })
    }
    const fetchLastMessage = await this.messageModel.findOne({ chatroomId: getChatroom._id }).sort({ createdAt: 1 });
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
  async createMessage(data: CreateMessageDtoMessageData, userId: string, deviceId?: string) {
    const getChatroom = await this.chatroomModel.findById(data.chatroomId)
    if (!getChatroom) {
      throw new NotFoundException('Chatroom not found!')
    }
    if (getChatroom.members.map(member => member.toString()).includes(userId) == false) {
      throw new UnauthorizedException('Not a member of chatroom')
    }

    const authorInfo = await this.userService.findOneProfile({ userId })
    if (!authorInfo) {
      throw new UnauthorizedException('Invalid Profile or User Credentials!')
    }


    const encryptorClass = new Encryptor();
    const roomEncryptionKey = encryptorClass.decrypt(getChatroom.encryptionSecretKey)

    const decryptedMessageText: string | null = (data.message.text != null && data.message.text.length > 0) ? encryptorClass.decrypt(data.message.text.toString(), roomEncryptionKey) : null


    const formattedMessage = {
      ...data.message,
      text: (decryptedMessageText != null && decryptedMessageText.length > 0) ? encryptorClass.encryptor(decryptedMessageText, roomEncryptionKey) : '',
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

    // send notifications to other members -- ✅
    const pushNotificationFormatted = await new NotificationFromMessageFormatter(saveMessage, this.deviceModel, this.chatroomModel, roomEncryptionKey, authorInfo).push();
    if (pushNotificationFormatted != null) {
      let notifierEventData: NotifierSingleChannelMessageEvent = new NotifierSingleChannelMessageEvent(MessageChannel.PUSH, pushNotificationFormatted)
      // - // send notification to required channel
      this.notifier.emit('singleChannelMessage', notifierEventData)
    }

    return { message: 'Message successfully created!', data: saveMessage };
  }

  async findAllUserMessages(userId: string) {
    const allUserMessages = await this.messageModel.find({ authorId: userId })
    return { message: 'Messages successfully fetched!', data: allUserMessages };
  }

  async findAllChatroomMessages(userId: string, roomId: string) {
    const allUserMessages = await this.messageModel.find({ chatroomId: roomId })
    return { message: 'Messages successfully fetched!', data: allUserMessages };
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
