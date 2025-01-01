import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose'; // Rename mongoose Schema
import { User } from './user.model';
import { Device } from './device.model';

export type UserDevicesMetaDocument = HydratedDocument<UserDevicesMeta>;

@Schema({ timestamps: true })
export class UserDevicesMeta {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true, maxlength: 5, type: Array<MongooseSchema.Types.ObjectId>, ref: 'Device', default: [] })
    androidDevices: Array<Types.ObjectId>;

    @Prop({ required: true, maxlength: 5, type: Array<MongooseSchema.Types.ObjectId>, ref: 'Device', default: [] })
    iosDevices: Array<Types.ObjectId>;

    @Prop({ required: true, maxlength: 5, type: Array<MongooseSchema.Types.ObjectId>, ref: 'Device', default: [] })
    webDevices: Array<Types.ObjectId>;

    @Prop({ required: true, maxlength: 5, type: Array<MongooseSchema.Types.ObjectId>, ref: 'Device', default: [] })
    desktopDevices: Array<Types.ObjectId>;

    @Prop({ required: true, default: 1, type: MongooseSchema.Types.Number })
    totalActiveSessions: number;
}

export const UserDevicesMetaSchema = SchemaFactory.createForClass(UserDevicesMeta); 
