import { PushNotificationMessage } from './../../../common/dtos/push_notification-message.dto';
import { Message } from './../models/message.model';
import { Device } from 'src/modules/user/models/device.model';
import { Model } from 'mongoose';
import { _ } from 'src/constant/variables.static';
import { ChatRoom } from '../models/chatroom.model';
import { Encryptor, getNameOrUsernameFromProfile } from 'src/utils/helpers';
import { Profile } from 'src/modules/user/models/profile.model';
import { PushNotificationType } from '../enums/type.lib';

export class NotificationFromMessageFormatter {
    protected _message: Message;
    protected _decryptionKey: string;
    encryptorClass = new Encryptor();
    protected _authorProfile: Profile;

    constructor(message: Message,
        private deviceModel: Model<Device>,
        private chatroonModel: Model<ChatRoom>,
        private decryptionKey: string,
        private authorProfile: Profile,
    ) {
        this._message = message;
        this._decryptionKey = decryptionKey;
        this._authorProfile = authorProfile;
    }

    async push(): Promise<PushNotificationMessage | null> {
        let usesToken = true;
        let secureTokens: string[] = [];
        const messageChatroom = await this.chatroonModel.findById(this._message.chatroomId);

        if (messageChatroom.notificationType != 'topic') {
            const membersToSendTo = messageChatroom.members.filter(member => {
                return (member.toString() != this._message.authorId.toString()) && !member.userDisabled
            })

            for (const member of membersToSendTo) {
                const allMemberDevices = await this.deviceModel.find({ activeUser: member })

                const userTokens = allMemberDevices.map(device => {
                    return device.fcmTokens
                })

                secureTokens = _.concat(secureTokens, _.flattenDeep(userTokens))
            }
        } else usesToken = false;
        const formattedAuthorInfo = _.create(this.authorProfile)
        delete formattedAuthorInfo.availableVerificationChannel

        return (usesToken && secureTokens.length > 0) || (!usesToken)
            ? new PushNotificationMessage({
                topic: !usesToken ? `chatroom-${messageChatroom._id.toString()}` : null,
                tokens: usesToken ? secureTokens : null,
                usesTopic: !usesToken,
                notification: {
                    title: getNameOrUsernameFromProfile(this._authorProfile),
                    body: this.encryptorClass.decrypt(this._message.message.text, this.decryptionKey)
                },
                data: {
                    "notificationType": PushNotificationType.MESSAGE,
                    "authorInfo": JSON.stringify(formattedAuthorInfo)
                }
            }) : null
    }
}