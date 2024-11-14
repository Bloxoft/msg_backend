import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { RoomType } from '../enums/type.lib';
import { User } from 'src/modules/user/models/user.model';
import { ChatRoomSettings } from './chatroom_settings.model';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ timestamps: true })
export class ChatRoom {
    @Prop({ required: true, type: Array<MongooseSchema.Types.ObjectId>, ref: 'User', minlength: 1 })
    members: Array<User>;

    @Prop({ required: true, type: Array<MongooseSchema.Types.ObjectId>, ref: 'User', default: [] })
    pinnedChats: Array<User>;

    @Prop({ required: true, default: RoomType.P2P })
    type: RoomType;

    @Prop({ required: true, default: new ChatRoomSettings() })
    settings: ChatRoomSettings;

    @Prop({ required: true })
    encryptionSecretKey: string;

    @Prop({ required: false })
    roomName: string;

    @Prop({ required: false })
    roomDescription: string;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    creatorUserId: User;

    @Prop({ required: true, default: Date.now, })
    createdAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
