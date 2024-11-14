import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/models/user.model";
import { Otp, OtpSchema } from "../otp/models/otp.model";
import { Profile, ProfileSchema } from "../user/models/profile.model";
import { Process, ProcessSchema } from "../processes/models/process.model";
import { ChatRoom, ChatRoomSchema } from "../messaging/models/chatroom.model";
import { Message, MessageSchema } from "../messaging/models/message.model";

const modules = [
    // shared
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    MongooseModule.forFeature([{ name: Process.name, schema: ProcessSchema }]),

    // user
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),

    // messaging feature
    MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
]

@Module({
    imports: modules,
    exports: modules,

})
export class MongoModels { }