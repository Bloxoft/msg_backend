import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model, Types } from 'mongoose';
import { Profile } from './models/profile.model';
import { extractPhoneNumberInfo, formatUsername, getNameFromProfile, normalizePhoneNumber } from 'src/utils/helpers';
import { Contact } from './classes/contact';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private user: Model<User>,
    @InjectModel(Profile.name) private profile: Model<Profile>,
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
          profilesFound.push(new Contact(findProfile.phoneNumberIntl, findProfile.email, findProfile.avatarUrl, findProfile.username, getNameFromProfile(findProfile), contact.deviceName, findProfile.countryCode));
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
}
