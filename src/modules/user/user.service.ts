import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model, Types } from 'mongoose';
import { Profile } from './models/profile.model';
import { formatUsername, getNameFromProfile, normalizePhoneNumber } from 'src/utils/helpers';
import { Contact } from './classes/contact';
import { AddDeviceDto } from './dto/add-device.dto';
import { Device } from './models/device.model';
import { UserDevicesMeta } from './models/user-devices-meta.model';
import { DevicePlatformType } from './enums/type.lib';
import { _ } from 'src/constant/variables.static';
import { SaveUserLastSessionDto } from './dto/save-last-session.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    @InjectModel(Profile.name) private profile: Model<Profile>,
    @InjectModel(Device.name) private device: Model<Device>,
    @InjectModel(UserDevicesMeta.name) private devicesMeta: Model<UserDevicesMeta>,
  ) { }
  async create(data: CreateUserDto) {
    const findExistingUser = await this.user.findOne({ phoneId: data.phoneId })
    if (findExistingUser) {
      throw new HttpException('User already exists', HttpStatus.EXPECTATION_FAILED)
    }
    return await this.user.create(data);
  }

  async createProfile(data: CreateProfileDto) {
    const findExistingProfile = await this.profile.findOne({ userId: data.userId })
    if (findExistingProfile) {
      throw new HttpException('Profile already exists', HttpStatus.EXPECTATION_FAILED)
    }
    return await this.profile.create({ ...data, username: formatUsername(data.username), currentLocale: data.locale, currentTimezone: data.timezone });
  }

  async checkUsernameStatus(username: String) {
    const findExistingUsername = await this.profile.findOne({ username: formatUsername(username) })
    if (findExistingUsername) {
      return { message: 'Status Checked', statusCode: 200, data: { exists: true } }
    } else {
      return { message: 'Status Checked', statusCode: 200, data: { exists: false } }
    }
  }

  async checkUsersFromContactsList(data: Contact[], userId: string) {
    const profilesFound: Contact[] = [];
    const userProfile = await this.profile.findOne({ userId })
    if (data.length > 0) {
      const phoneIdsSaved: string[] = [];
      for (const contact of data) {
        let findProfile = await this.profile.findOne({ phoneNumberIntl: contact.phoneId })
        if (!findProfile) {
          try {
            findProfile = await this.profile.findOne({ phoneNumberIntl: normalizePhoneNumber(contact.phoneId, userProfile.countryCode).substring(1) })
          } catch (error) {
            continue;
          }
        }

        if (findProfile && !phoneIdsSaved.includes(findProfile.phoneNumberIntl)) {
          phoneIdsSaved.push(findProfile.phoneNumberIntl)
          profilesFound.push(new Contact(findProfile.userId.toString(), findProfile.phoneNumberIntl, findProfile.email, findProfile.avatarUrl, findProfile.username, getNameFromProfile(findProfile), contact.deviceName, findProfile.countryCode));
        }
      }
    }

    return { message: 'Contacts Checked', statusCode: 200, data: profilesFound }
  }

  async findOneUser(query: Object) {
    return await this.user.findOne(query)
  }
  async findOneProfile(query: Object) {
    return await this.profile.findOne(query)
  }

  async findUserById(id: String) {
    return await this.user.findById(id)
  }
  async findProfileById(id: String) {
    return await this.profile.findById(id)
  }



  // device management
  async addOrUpdateDevice(data: AddDeviceDto, userId: string) {
    const findExistingDevice = await this.device.findOne({
      platform: data.platform,
      serialNumber: data.serialNumber,
      uniqueData: data.uniqueData,
      deviceId: data.deviceId,
      deviceName: data.deviceName
    })

    let deviceToWorkWith = findExistingDevice;

    if (!findExistingDevice) {
      deviceToWorkWith = new this.device({
        ...data,
        activeUser: userId,
        userLoginTimestamp: data.loginTimestamp,
        lastSessionUser: userId,
        lastSessionTimestamp: data.loginTimestamp,
        fcmTokens: []
      })
    }

    if (data.deviceFcmToken && !deviceToWorkWith.fcmTokens.includes(data.deviceFcmToken)) {
      deviceToWorkWith.fcmTokens.push(data.deviceFcmToken)
    }

    if (data.metadata != null && data.metadata != undefined) {
      deviceToWorkWith.metadata = data.metadata
    }
    if (data.uniqueData != null && data.uniqueData != undefined) {
      deviceToWorkWith.uniqueData = data.uniqueData
    }
    if (data.loginTimestamp != null && data.loginTimestamp != undefined) {
      const findUser = await this.user.findById(userId)
      deviceToWorkWith.lastSessionTimestamp = data.loginTimestamp
      deviceToWorkWith.userLoginTimestamp = data.loginTimestamp
      deviceToWorkWith.lastSessionUser = findUser
      deviceToWorkWith.activeUser = findUser
    }


    const createdDevice = await deviceToWorkWith.save()

    // update user device meta
    const findExistingDevicesMeta = await this.devicesMeta.findOne({
      userId: userId,
    })

    let metaDocToWorkWith = findExistingDevicesMeta;

    if (!metaDocToWorkWith) {
      metaDocToWorkWith = new this.devicesMeta({
        userId,
        androidDevices: [],
        iosDevices: [],
        webDevices: [],
        desktopDevices: [],
        totalActiveSessions: 0,
      })
    }

    switch (data.platform) {
      case DevicePlatformType.ANDROID:
        if (!metaDocToWorkWith.androidDevices.includes(createdDevice._id)) {
          metaDocToWorkWith.androidDevices.push(createdDevice._id)
        }
        break;
      case DevicePlatformType.IOS:
        if (!metaDocToWorkWith.iosDevices.includes(createdDevice._id)) {
          metaDocToWorkWith.iosDevices.push(createdDevice._id)
        }
        break;
      case DevicePlatformType.WEB:
        if (!metaDocToWorkWith.webDevices.includes(createdDevice._id)) {
          metaDocToWorkWith.webDevices.push(createdDevice._id)
        }
        break;
      case DevicePlatformType.MACOS:
      case DevicePlatformType.WINDOWS:
        if (!metaDocToWorkWith.desktopDevices.includes(createdDevice._id)) {
          metaDocToWorkWith.desktopDevices.push(createdDevice._id)
        }
        break;
    }

    metaDocToWorkWith.totalActiveSessions += 1;

    await metaDocToWorkWith.save()


    return { message: 'Device created', statusCode: 200, data: createdDevice }
  }

  async removeUserFromDevice(devices: Array<string>, userId: string) {
    // update user device meta
    const findExistingDevicesMeta = await this.devicesMeta.findOne({
      userId: userId,
    })
    if (!findExistingDevicesMeta) {
      throw new NotFoundException('No device record found!')
    }
    if (devices.length > 0) {
      for (const deviceId of devices) {
        const findExistingDevice = await this.device.findById(deviceId);

        if (findExistingDevice) {
          if (findExistingDevice.fcmTokens.length > 0 || findExistingDevice.subscribedFcmTopics.length > 0) {
            findExistingDevice.activeUser = null;
            findExistingDevice.userLoginTimestamp = null;

            await findExistingDevice.save()
          } else {
            await findExistingDevice.deleteOne()
          }

          switch (findExistingDevice.platform) {
            case DevicePlatformType.ANDROID:

              findExistingDevicesMeta.androidDevices = _.filter(findExistingDevicesMeta.androidDevices, (val, index) => {
                return val.toString() != findExistingDevice._id.toString()
              })
              break;
            case DevicePlatformType.IOS:
              findExistingDevicesMeta.androidDevices = _.filter(findExistingDevicesMeta.iosDevices, (val, index) => {
                return val.toString() != findExistingDevice._id.toString()
              })
              break;
            case DevicePlatformType.WEB:
              findExistingDevicesMeta.androidDevices = _.filter(findExistingDevicesMeta.webDevices, (val, index) => {
                return val.toString() != findExistingDevice._id.toString()
              })
              break;
            case DevicePlatformType.MACOS:
            case DevicePlatformType.WINDOWS:
              findExistingDevicesMeta.androidDevices = _.filter(findExistingDevicesMeta.desktopDevices, (val, index) => {
                return val.toString() != findExistingDevice._id.toString()
              })
              break;
          }


          if (findExistingDevicesMeta.totalActiveSessions > 0) {
            findExistingDevicesMeta.totalActiveSessions -= 1
          }
        }
      }
      const saveMeta = await findExistingDevicesMeta.save();
    }

    return { message: 'Device session ended', statusCode: 200 }
  }

  async validateDeviceSession(deviceId: string, userId: string) {
    const findExistingDevice = await this.device.findById(deviceId);

    const findExistingDevicesMeta = await this.devicesMeta.findOne({
      userId: userId,
    })

    let sessionValidated = false;

    if (findExistingDevice && findExistingDevicesMeta && findExistingDevice.activeUser.toString() == userId && findExistingDevice.userLoginTimestamp && findExistingDevicesMeta.totalActiveSessions > 0) {
      switch (findExistingDevice.platform) {
        case DevicePlatformType.ANDROID:
          if (findExistingDevicesMeta.androidDevices.includes(findExistingDevice._id)) {
            sessionValidated = true;
          }
          break;
        case DevicePlatformType.IOS:
          if (findExistingDevicesMeta.iosDevices.includes(findExistingDevice._id)) {
            sessionValidated = true;
          }
          break;
        case DevicePlatformType.WEB:
          if (findExistingDevicesMeta.webDevices.includes(findExistingDevice._id)) {
            sessionValidated = true;
          }
          break;
        case DevicePlatformType.MACOS:
        case DevicePlatformType.WINDOWS:
          if (findExistingDevicesMeta.desktopDevices.includes(findExistingDevice._id)) {
            sessionValidated = true;
          }
          break;
      }
    }

    return { message: 'Device session validation successful', statusCode: 200, data: { isSessionValid: sessionValidated } }
  }

  async saveLastUserSession(data: SaveUserLastSessionDto, userId: string) {
    const findExistingDevice = await this.device.findById(data.deviceId);
    if (!findExistingDevice) {
      throw new NotFoundException('No device found!')
    }

    const findUser = await this.user.findById(userId)

    findExistingDevice.lastSessionTimestamp = data.timestamp;
    findExistingDevice.lastSessionUser = findUser;
    return { message: 'Device session saved successfully', statusCode: 200 }
  }
}

