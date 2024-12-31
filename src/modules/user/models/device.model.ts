import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'; // Rename mongoose Schema
import { DevicePlatformType } from '../enums/type.lib';
import { User } from './user.model';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ timestamps: true })
export class Device {
    @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    activeUser: User;

    @Prop({ required: true, default: DevicePlatformType.ANDROID })
    platform: DevicePlatformType;

    @Prop({ required: true, type: MongooseSchema.Types.Map })
    metadata: Object;

    @Prop({ required: true, type: MongooseSchema.Types.Map })
    uniqueData: Object;

    @Prop({ required: true })
    deviceName: string;

    @Prop({ required: false, type: MongooseSchema.Types.String })
    serialNumber: string;

    @Prop({ required: true, default: null })
    deviceId: string;

    @Prop({ required: true, type: MongooseSchema.Types.Array, default: [] })
    fcmTokens: Array<string>;

    @Prop({ required: true, type: MongooseSchema.Types.Array, default: [] })
    subscribedFcmTopics: Array<string>;

    @Prop({ required: false, type: MongooseSchema.Types.Date })
    userLoginTimestamp: Date;

    @Prop({ required: false, type: MongooseSchema.Types.Date })
    lastSessionTimestamp: Date;

    @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    lastSessionUser: User;
}

export const DeviceSchema = SchemaFactory.createForClass(Device); 
