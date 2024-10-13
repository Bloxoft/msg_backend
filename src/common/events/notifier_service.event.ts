import { EmailMessage } from "../dtos/email-message.dto";
import { MessageChannel } from "../enums/channels.enum";


export class NotifierSingleChannelMessageEvent {
    channel: MessageChannel;
    data: unknown | Object | EmailMessage;

    constructor(channel: MessageChannel, data: unknown | Object | EmailMessage) {
        this.channel = channel;
        this.data = data;
    }
}
