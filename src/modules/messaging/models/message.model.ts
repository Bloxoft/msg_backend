import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/modules/user/models/user.model';
import { ChatRoom } from './chatroom.model';
import { MSGDeleteType } from '../enums/type.lib';
import { MediaFormat, MediaType } from 'src/common/enums/messaging.enum';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class EmojiReactionSchema {
    @Prop({ required: true, default: '👍' })
    emoji: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    authorId: User;
}

@Schema()
export class MSGMediaSchema {
    @Prop({ required: true })
    mediaUrl: string;

    @Prop({ required: true, default: MediaType.IMAGE })
    mediaType: MediaType;

    @Prop({ required: true, default: MediaFormat.IMAGE_PNG })
    mediaFormat: MediaFormat;
}

@Schema({ timestamps: true })
export class MSGSchema {
    @Prop({ required: true, default: '' })
    text: string;

    @Prop({ required: true, type: MongooseSchema.Types.Boolean, default: false })
    edited: Boolean;

    @Prop({ required: false, type: MongooseSchema.Types.Date })
    editedOn: Date;

    @Prop({ required: false })
    media: MSGMediaSchema;
}

@Schema({ timestamps: true })
export class MSGDeleteSchema {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    authorId: User;

    @Prop({ required: true, default: MSGDeleteType.PERSONAL })
    type: MSGDeleteType;
}

@Schema({ timestamps: true })
export class Message {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    authorId: User;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'ChatRoom' })
    chatroomId: ChatRoom;

    @Prop({ required: true, type: Array<MongooseSchema.Types.ObjectId>, ref: 'ChatRoom' })
    roomsForwardedTo: Array<ChatRoom>;

    @Prop({ required: true })
    message: MSGSchema;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'Message' })
    replyMessage: Message;

    @Prop({ required: false })
    replyMessageText: string;

    @Prop({ required: true, default: [] })
    reactions: Array<EmojiReactionSchema>;

    @Prop({ required: true, default: [] })
    deletes: Array<MSGDeleteSchema>;

    @Prop({ required: true, type: Array<MongooseSchema.Types.ObjectId>, ref: 'User', default: [] })
    readBy: Array<User>;

    @Prop({ required: true, default: 'Europe/London' })
    timestampTimezone: string;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
