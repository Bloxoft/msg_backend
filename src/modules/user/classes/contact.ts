export class Contact {
    phoneId: string;
    email?: string;
    avatarUrl?: string;
    username?: string;
    fullName?: string;
    deviceName?: string;
    countryISOCode?: string;

    constructor(
        phoneId: string,
        email?: string,
        avatarUrl?: string,
        username?: string,
        fullName?: string,
        deviceName?: string,
        countryISOCode?: string,
    ) {
        this.phoneId = phoneId;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.username = username;
        this.fullName = fullName;
        this.deviceName = deviceName;
        this.countryISOCode = countryISOCode;
    }
}