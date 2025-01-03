import { PushNotificationMessage } from './../dtos/push_notification-message.dto';
import { EmailMessage } from "../dtos/email-message.dto";
import { SmsMessage } from "../dtos/sms-message.dto";
import { MessageChannel } from "../enums/channels.enum";


export class NotifierSingleChannelMessageEvent {
    channel: MessageChannel;
    data: Object | EmailMessage | SmsMessage | PushNotificationMessage;

    constructor(channel: MessageChannel, data: Object | EmailMessage | SmsMessage | PushNotificationMessage) {
        this.channel = channel;
        this.data = data;
    }
}
