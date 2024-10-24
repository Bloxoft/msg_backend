import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.model';
import { MessageChannel } from 'src/common/enums/channels.enum';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true, default: 'en_US' })
    locale: string;

    @Prop({ required: true, default: 'UTC' })
    timezone: string;

    @Prop({ required: true, default: 'en_US' })
    currentLocale: string;

    @Prop({ required: true, default: 'UTC' })
    currentTimezone: string;

    @Prop({ required: true, default: MessageChannel.SMS })
    defaultVerificationChannel: string;

    @Prop({ required: true, default: [MessageChannel.SMS] })
    availableVerificationChannel: Array<string>;

    @Prop({ required: true, trim: true })
    phoneNumberIntl: string;

    @Prop({ required: true, unique: true, trim: true, minlength: 2, maxlength: 20 })
    username: string;

    @Prop({ required: true, })
    countryCode: string;

    @Prop({ required: true, })
    currency: string;

    @Prop({ trim: true })
    firstName: string;

    @Prop({ trim: true })
    lastName: string;

    @Prop({ required: false, trim: true, set: (v: string) => v.toLowerCase(), unique: true })
    email: string;

    @Prop({ required: false })
    bio: string;

    @Prop({ required: true, })
    avatarUrl: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
