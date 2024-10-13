export class EmailMessage {
    emails: Array<string>;
    subject: string;
    template?: string;
    context?: {}
    senderConfig?: SenderConfig
}
class SenderConfig {
    host: string;
    port: number;
    from: string;
    password: string;
    user: string
}