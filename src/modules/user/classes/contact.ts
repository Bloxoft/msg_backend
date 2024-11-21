export class Contact {
    userId: string;
    phoneId: string;
    email?: string;
    avatarUrl?: string;
    username?: string;
    fullName?: string;
    deviceName?: string;
    countryISOCode?: string;

    constructor(
        userId: string,
        phoneId: string,
        email?: string,
        avatarUrl?: string,
        username?: string,
        fullName?: string,
        deviceName?: string,
        countryISOCode?: string,
    ) {
        this.userId = userId;
        this.phoneId = phoneId;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.username = username;
        this.fullName = fullName;
        this.deviceName = deviceName;
        this.countryISOCode = countryISOCode;
    }
}