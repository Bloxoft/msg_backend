export class PushNotificationMessage {
    // Device tokens to send to
    tokens?: string[];

    // Device topic to send to
    topic?: string;

    // Set if topics or token would be used
    usesTopic?: boolean;

    notification?: Notification;

    // Custom data payload
    data?: { [key: string]: string };

    // Android-specific options
    android?: AndroidConfig;

    // iOS-specific options
    apns?: ApnsConfig;

    // iOS-specific options
    webpush?: WebpushConfig;

    constructor(init?: Partial<PushNotificationMessage>) {
        Object.assign(this, init);
    }
}

class Notification {
    // Notification title
    title: string;

    // Notification body text
    body: string;

    // URL of an image to display in the notification
    imageUrl?: string;

    constructor(init?: Partial<Notification>) {
        Object.assign(this, init);
    }
}

class AndroidConfig {
    /**
     * Collapse key for the message. Collapse key serves as an identifier for a
     * group of messages that can be collapsed, so that only the last message gets
     * sent when delivery can be resumed. A maximum of four different collapse keys
     * may be active at any given time.
     */
    collapseKey?: string;
    /**
     * Priority of the message. Must be either `normal` or `high`.
     */
    priority?: ('high' | 'normal');
    /**
     * Time-to-live duration of the message in milliseconds.
     */
    ttl?: number;
    /**
     * Package name of the application where the registration tokens must match
     * in order to receive the message.
     */
    restrictedPackageName?: string;

    data?: {
        [key: string]: string;
    };
    /**
     * Android notification to be included in the message.
     */
    notification?: AndroidNotification;
    /**
     * Options for features provided by the FCM SDK for Android.
     */
    fcmOptions?: {
        analyticsLabel?: string;
    };
    /**
    * A boolean indicating whether messages will be allowed to be delivered to
    * the app while the device is in direct boot mode.
    */
    directBootOk?: boolean;

    constructor(init?: Partial<AndroidConfig>) {
        Object.assign(this, init);
    }
}

class AndroidNotification {
    /**
     * Title of the Android notification. When provided, overrides the title set via
     * `admin.messaging.Notification`.
     */
    title?: string;
    /**
     * Body of the Android notification. When provided, overrides the body set via
     * `admin.messaging.Notification`.
     */
    body?: string;
    /**
     * Icon resource for the Android notification.
     */
    icon?: string;
    /**
     * Notification icon color in `#rrggbb` format.
     */
    color?: string;
    /**
     * File name of the sound to be played when the device receives the
     * notification.
     */
    sound?: string;
    /**
     * Notification tag. This is an identifier used to replace existing
     * notifications in the notification drawer. If not specified, each request
     * creates a new notification.
     */
    tag?: string;
    /**
     * URL of an image to be displayed in the notification.
     */
    imageUrl?: string;
    /**
     * Action associated with a user click on the notification. If specified, an
     * activity with a matching Intent Filter is launched when a user clicks on the
     * notification.
     */
    clickAction?: string;
    /**
     * Key of the body string in the app's string resource to use to localize the
     * body text.
     *
     */
    bodyLocKey?: string;
    /**
     * An array of resource keys that will be used in place of the format
     * specifiers in `bodyLocKey`.
     */
    bodyLocArgs?: string[];
    /**
     * Key of the title string in the app's string resource to use to localize the
     * title text.
     */
    titleLocKey?: string;
    /**
     * An array of resource keys that will be used in place of the format
     * specifiers in `titleLocKey`.
     */
    titleLocArgs?: string[];
    /**
     * The Android notification channel ID (new in Android O). The app must create
     * a channel with this channel ID before any notification with this channel ID
     * can be received. If you don't send this channel ID in the request, or if the
     * channel ID provided has not yet been created by the app, FCM uses the channel
     * ID specified in the app manifest.
     */
    channelId?: string;
    /**
     * Sets the "ticker" text, which is sent to accessibility services. Prior to
     * API level 21 (Lollipop), sets the text that is displayed in the status bar
     * when the notification first arrives.
     */
    ticker?: string;
    /**
     * When set to `false` or unset, the notification is automatically dismissed when
     * the user clicks it in the panel. When set to `true`, the notification persists
     * even when the user clicks it.
     */
    sticky?: boolean;
    /**
     * For notifications that inform users about events with an absolute time reference, sets
     * the time that the event in the notification occurred. Notifications
     * in the panel are sorted by this time.
     */
    eventTimestamp?: Date;
    /**
     * Sets whether or not this notification is relevant only to the current device.
     * Some notifications can be bridged to other devices for remote display, such as
     * a Wear OS watch. This hint can be set to recommend this notification not be bridged.
     * See {@link https://developer.android.com/training/wearables/notifications/bridger#existing-method-of-preventing-bridging |
     * Wear OS guides}.
     */
    localOnly?: boolean;
    /**
     * Sets the relative priority for this notification. Low-priority notifications
     * may be hidden from the user in certain situations. Note this priority differs
     * from `AndroidMessagePriority`. This priority is processed by the client after
     * the message has been delivered. Whereas `AndroidMessagePriority` is an FCM concept
     * that controls when the message is delivered.
     */
    priority?: ('min' | 'low' | 'default' | 'high' | 'max');
    /**
     * Sets the vibration pattern to use. Pass in an array of milliseconds to
     * turn the vibrator on or off. The first value indicates the duration to wait before
     * turning the vibrator on. The next value indicates the duration to keep the
     * vibrator on. Subsequent values alternate between duration to turn the vibrator
     * off and to turn the vibrator on. If `vibrateTimingsMillis` is set and `defaultVibrateTimings`
     * is set to `true`, the default value is used instead of the user-specified `vibrateTimingsMillis`.
     */
    vibrateTimingsMillis?: number[];
    /**
     * If set to `true`, use the Android framework's default vibrate pattern for the
     * notification. Default values are specified in {@link https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml |
     * config.xml}. If `defaultVibrateTimings` is set to `true` and `vibrateTimingsMillis` is also set,
     * the default value is used instead of the user-specified `vibrateTimingsMillis`.
     */
    defaultVibrateTimings?: boolean;
    /**
     * If set to `true`, use the Android framework's default sound for the notification.
     * Default values are specified in {@link https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml |
     * config.xml}.
     */
    defaultSound?: boolean;
    /**
     * Settings to control the notification's LED blinking rate and color if LED is
     * available on the device. The total blinking time is controlled by the OS.
     */
    lightSettings?: LightSettings;
    /**
     * If set to `true`, use the Android framework's default LED light settings
     * for the notification. Default values are specified in {@link https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml |
     * config.xml}.
     * If `default_light_settings` is set to `true` and `light_settings` is also set,
     * the user-specified `light_settings` is used instead of the default value.
     */
    defaultLightSettings?: boolean;
    /**
     * Sets the visibility of the notification. Must be either `private`, `public`,
     * or `secret`. If unspecified, defaults to `private`.
     */
    visibility?: ('private' | 'public' | 'secret');
    /**
     * Sets the number of items this notification represents. May be displayed as a
     * badge count for Launchers that support badging. See {@link https://developer.android.com/training/notify-user/badges |
     * NotificationBadge}.
     * For example, this might be useful if you're using just one notification to
     * represent multiple new messages but you want the count here to represent
     * the number of total new messages. If zero or unspecified, systems
     * that support badging use the default, which is to increment a number
     * displayed on the long-press menu each time a new notification arrives.
     */
    notificationCount?: number;

    constructor(init?: Partial<AndroidNotification>) {
        Object.assign(this, init);
    }
}

class LightSettings {
    /**
     * Required. Sets color of the LED in `#rrggbb` or `#rrggbbaa` format.
     */
    color: string;
    /**
     * Required. Along with `light_off_duration`, defines the blink rate of LED flashes.
     */
    lightOnDurationMillis: number;
    /**
     * Required. Along with `light_on_duration`, defines the blink rate of LED flashes.
     */
    lightOffDurationMillis: number;

    constructor(init?: Partial<LightSettings>) {
        Object.assign(this, init);
    }
}

class ApnsConfig {
    /**
     * A collection of APNs headers. Header values must be strings.
     */
    headers?: {
        [key: string]: string;
    };
    /**
     * An APNs payload to be included in the message.
     */
    payload?: {
        aps: Aps;
        [customData: string]: any;
    };
    /**
     * Options for features provided by the FCM SDK for iOS.
     */
    fcmOptions?: {
        analyticsLabel?: string;
    };

    constructor(init?: Partial<ApnsConfig>) {
        Object.assign(this, init);
    }
}

class Aps {
    /**
     * Alert to be included in the message. This may be a string or an object of
     * type `admin.messaging.ApsAlert`.
     */
    alert?: string | ApsAlert;
    /**
     * Badge to be displayed with the message. Set to 0 to remove the badge. When
     * not specified, the badge will remain unchanged.
     */
    badge?: number;
    /**
     * Specifies whether to configure a background update notification.
     */
    contentAvailable?: boolean;
    /**
     * Specifies whether to set the `mutable-content` property on the message
     * so the clients can modify the notification via app extensions.
     */
    mutableContent?: boolean;
    /**
     * Type of the notification.
     */
    category?: string;
    /**
     * An app-specific identifier for grouping notifications.
     */
    threadId?: string;
    [customData: string]: any;

    constructor(init?: Partial<Aps>) {
        Object.assign(this, init);
    }
}

class ApsAlert {
    title?: string;
    subtitle?: string;
    body?: string;
    locKey?: string;
    locArgs?: string[];
    titleLocKey?: string;
    titleLocArgs?: string[];
    subtitleLocKey?: string;
    subtitleLocArgs?: string[];
    actionLocKey?: string;
    launchImage?: string;

    constructor(init?: Partial<ApsAlert>) {
        Object.assign(this, init);
    }
}

class WebpushConfig {
    /**
     * A collection of WebPush headers. Header values must be strings.
     *
     * See {@link https://tools.ietf.org/html/rfc8030#section-5 | WebPush specification}
     * for supported headers.
     */
    headers?: {
        [key: string]: string;
    };
    /**
     * A collection of data fields.
     */
    data?: {
        [key: string]: string;
    };
    /**
     * A WebPush notification payload to be included in the message.
     */
    notification?: WebpushNotification;
    /**
     * Options for features provided by the FCM SDK for Web.
     */
    fcmOptions?: WebpushFcmOptions;

    constructor(init?: Partial<WebpushConfig>) {
        Object.assign(this, init);
    }
}

/** Represents options for features provided by the FCM SDK for Web
 * (which are not part of the Webpush standard).
 */
interface WebpushFcmOptions {
    /**
     * The link to open when the user clicks on the notification.
     * For all URL values, HTTPS is required.
     */
    link?: string;
}

class WebpushNotification {
    /**
     * Title text of the notification.
     */
    title?: string;
    /**
     * An array of notification actions representing the actions
     * available to the user when the notification is presented.
     */
    actions?: Array<{
        /**
         * An action available to the user when the notification is presented
         */
        action: string;
        /**
         * Optional icon for a notification action.
         */
        icon?: string;
        /**
         * Title of the notification action.
         */
        title: string;
    }>;
    /**
     * URL of the image used to represent the notification when there is
     * not enough space to display the notification itself.
     */
    badge?: string;
    /**
     * Body text of the notification.
     */
    body?: string;
    /**
     * Arbitrary data that you want associated with the notification.
     * This can be of any data type.
     */
    data?: any;
    /**
     * The direction in which to display the notification. Must be one
     * of `auto`, `ltr` or `rtl`.
     */
    dir?: 'auto' | 'ltr' | 'rtl';
    /**
     * URL to the notification icon.
     */
    icon?: string;
    /**
     * URL of an image to be displayed in the notification.
     */
    image?: string;
    /**
     * The notification's language as a BCP 47 language tag.
     */
    lang?: string;
    /**
     * A boolean specifying whether the user should be notified after a
     * new notification replaces an old one. Defaults to false.
     */
    renotify?: boolean;
    /**
     * Indicates that a notification should remain active until the user
     * clicks or dismisses it, rather than closing automatically.
     * Defaults to false.
     */
    requireInteraction?: boolean;
    /**
     * A boolean specifying whether the notification should be silent.
     * Defaults to false.
     */
    silent?: boolean;
    /**
     * An identifying tag for the notification.
     */
    tag?: string;
    /**
     * Timestamp of the notification. Refer to
     * https://developer.mozilla.org/en-US/docs/Web/API/notification/timestamp
     * for details.
     */
    timestamp?: number;
    /**
     * A vibration pattern for the device's vibration hardware to emit
     * when the notification fires.
     */
    vibrate?: number | number[];
    [key: string]: any;


    constructor(init?: Partial<WebpushNotification>) {
        Object.assign(this, init);
    }
}