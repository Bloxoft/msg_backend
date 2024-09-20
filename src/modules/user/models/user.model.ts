import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'; // Rename mongoose Schema

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    phoneId: string;

    @Prop({ required: true, maxlength: 4 })
    phonePrefix: string;

    @Prop({ required: true, default: false })
    verifiedUser: boolean;

    @Prop({ required: true, default: false })
    userDisabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User); 
