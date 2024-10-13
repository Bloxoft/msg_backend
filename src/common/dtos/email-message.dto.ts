/**
 * Represents an email message with optional template and context.
 */
export class EmailMessage {
    /**
     * The email address or addresses to send the message to.
     * Can be a single email address or an array of email addresses.
     */
    emailAddresses: string | Array<string>;

    /**
     * The subject of the email message.
     */
    subject: string;

    /**
     * The template to use for the email message, if any.
     */
    template?: string;

    /**
     * The context data to be used in the email template, if any.
     */
    context?: {};

    /**
     * Configuration for the email sender, if any.
     */
    senderConfig?: SenderConfig;
}

/**
 * Configuration details for the email sender.
 */
class SenderConfig {
    /**
     * The host address of the email server.
     */
    host: string;

    /**
     * The port number to connect to the email server.
     */
    port: number;

    /**
     * The email address name or description to use as the sender.
     */
    from: string;

    /**
     * The password for the email server authentication.
     */
    password: string;

    /**
     * The user name  and email address for the email server authentication.
     */
    user: string;
}
