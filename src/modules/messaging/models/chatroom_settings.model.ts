import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ChatRoomSettingsDocument = HydratedDocument<ChatRoomSettings>;

@Schema()
export class PermissionsSchema {
    @Prop({ required: true, type: MongooseSchema.Types.Boolean, default: true })
    canAddMemebers: Boolean;
}

@Schema({ timestamps: true })
export class ChatRoomSettings {
    @Prop({ required: false, type: PermissionsSchema })
    permissions: PermissionsSchema;
}


export const ChatRoomSettingsSchema = SchemaFactory.createForClass(ChatRoomSettings);
