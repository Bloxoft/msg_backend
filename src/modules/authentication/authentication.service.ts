import { ProcessType } from './../processes/enums/type.lib';
import { HttpException, HttpStatus, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { StartAuthDto } from './dto/start-auth.dto';
import { User } from '../user/models/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { extractPhoneNumberInfo } from 'src/utils/helpers';
import { OtpService } from '../otp/otp.service';
import { ProcessService } from '../processes/process.service';
import { NotifierSingleChannelMessageEvent } from 'src/common/events/notifier_service.event';
import { MessageChannel } from 'src/common/enums/channels.enum';
import { EmailMessage } from 'src/common/dtos/email-message.dto';
import { Profile } from '../user/models/profile.model';
import { SmsMessage } from 'src/common/dtos/sms-message.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { VerifyOtpDto } from '../otp/dto/verify-otp.dto';
import { FinishAuthDto } from './dto/finish-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JWT_ENCRYPTION_KEY } from 'src/config/env.config';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(MicroservicesName.NOTIFIER) private notifier: ClientProxy,
    @InjectModel(User.name) private user: Model<User>,
    @InjectModel(Profile.name) private profile: Model<Profile>,
    private readonly otpService: OtpService,
    private readonly processService: ProcessService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  // Initiates the registration process for a new user
  async startAuthenticationProcess(data: StartAuthDto) {
    // Extract and normalize the phone number
    const transformPhoneNumber = extractPhoneNumberInfo(data.phoneNumberIntl);

    const phoneId = transformPhoneNumber.intlNumber

    // Check if a user with this phone number already exists
    const findExistingUser = await this.user.findOne({ phoneId })

    const authProcessData = await this.processService.create({
      phoneId,
      type: findExistingUser ? ProcessType.AuthLogin : ProcessType.AuthRegistration
    })

    const createdOTP = await this.otpService.create({
      length: 6,
      processId: authProcessData._id.toString(),
    })
    let notifierEventData: NotifierSingleChannelMessageEvent = new NotifierSingleChannelMessageEvent(MessageChannel.SMS, {
      message: `Your MSG ${findExistingUser ? 'Login' : 'Registration'} verification code is: \n ${createdOTP.substring(0, 3)}-${createdOTP.substring(3, 6)} \n \n ${data.metadata?.appSignature}`,
      phoneNumber: phoneId
    } as SmsMessage)

    let userSupportsEmailChannel: string = null;

    if (findExistingUser) {
      const userProfile = await this.profile.findOne({ userId: findExistingUser._id })
      if (userProfile && userProfile.availableVerificationChannel.includes(MessageChannel.EMAIL) && userProfile.email != null) {
        userSupportsEmailChannel = userProfile.email;
      }
      const caseToRun = data.verificationChannel && data.verificationChannel.length > 0 ? data.verificationChannel : userProfile.defaultVerificationChannel;
      switch (caseToRun) {
        case MessageChannel.EMAIL:
          notifierEventData = new NotifierSingleChannelMessageEvent(MessageChannel.EMAIL, {
            emailAddresses: userProfile.email,
            subject: `${findExistingUser ? 'Login' : 'Registration'} verification code has been sent to your email`,
            template: 'auth/verification_code',
            context: {
              code: createdOTP,
              user: userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : 'John Doe',
              process: findExistingUser ? 'Login' : 'Registration'
            }
          } as EmailMessage)
          break;

        default:
          break;
      }
    }

    // send notification to required channel
    this.notifier.emit('singleChannelMessage', notifierEventData)


    // TODO: Implement sending verification code logic
    return {
      message: 'Verification code sent successfully!', data: {
        processId: authProcessData._id,
        supportsEmail: userSupportsEmailChannel ? true : false,
        userEmail: userSupportsEmailChannel,
        channelUsed: notifierEventData.channel
      }
    }
  }

  async verifyAuthenticationProcess(data: VerifyAuthDto) {
    const findProcess = await this.processService.findById(data.processId)
    if (findProcess == null) {
      throw new NotFoundException('No process found')
    }
    const getUserFromProcess = await this.userService.findOneUser({ phoneId: findProcess.phoneId })

    if (findProcess.completed == true) {
      return { message: 'Verified', data: { userExists: getUserFromProcess ? true : false } }
    } else {
      const verifyOtp = await this.otpService.verifyOtp({
        otp: data.code,
        processId: data.processId
      } as VerifyOtpDto)

      if (verifyOtp === true) {
        await this.processService.complete(data.processId)
        return { message: 'Verified', data: { userExists: getUserFromProcess ? true : false } }
      } else if (verifyOtp === false) {
        throw new NotAcceptableException('Incorrect OTP');
      }
    }
  }

  async finishAuthenticationProcess(data: FinishAuthDto) {
    const findProcess = await this.processService.findById(data.processId)
    if (findProcess == null) {
      throw new NotFoundException('Invalid Authentication Process')
    }

    if (findProcess.completed == true) {
      const transformPhoneNumber = extractPhoneNumberInfo(data.phoneNumberIntl);
      switch (data.type) {
        case 'REGISTRATION':
          const createUser = await this.userService.create({ phoneId: transformPhoneNumber.intlNumber, phonePrefix: transformPhoneNumber.prefix })
          const createProfile = await this.userService.createProfile({ userId: createUser._id, ...data });
          await this.processService.remove(data.processId)
          return {
            message: 'Registered Successfully!', statusCode: HttpStatus.CREATED, data: {
              profile: createProfile,
              user: createUser,
              sessionToken: this.generateJwt(createUser.id)
            }
          }

        case 'LOGIN':
          const findUser = await this.userService.findOneUser({ phoneId: findProcess.phoneId })
          if (!findUser) {
            throw new NotFoundException('User not found!')
          }
          const findProfile = await this.userService.findOneProfile({ userId: findUser._id })
          await this.processService.remove(data.processId)
          return {
            message: 'Login Successfully!', statusCode: HttpStatus.ACCEPTED, data: {
              profile: findProfile,
              user: findUser,
              sessionToken: this.generateJwt(findUser.id)
            }
          }
      }
    } else {
      throw new HttpException('Authentication process not completed', HttpStatus.PRECONDITION_REQUIRED)
    }
  }

  generateJwt(userId: String): string {
    return this.jwtService.sign({ userId }, { secret: JWT_ENCRYPTION_KEY })
  }

  validateToken(token: String) {
    return this.jwtService.verify(token.toString(), {
      secret: process.env.JWT_SECRET_KEY
    }) as { userId: string };
  }
}
