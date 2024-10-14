import { EmailMessage } from "../dtos/email-message.dto";
import { SmsMessage } from "../dtos/sms-message.dto";
import { MessageChannel } from "../enums/channels.enum";


export class NotifierSingleChannelMessageEvent {
    channel: MessageChannel;
    data: Object | EmailMessage | SmsMessage;

    constructor(channel: MessageChannel, data: Object | EmailMessage | SmsMessage) {
        this.channel = channel;
        this.data = data;
    }
}
