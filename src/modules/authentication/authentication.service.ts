import { ProcessType } from './../processes/enums/type.lib';
import { Inject, Injectable } from '@nestjs/common';
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
import _ from "lodash";
import { SmsMessage } from 'src/common/dtos/sms-message.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('NOTIFIER_SERVICE') private notifier: ClientProxy,
    @InjectModel(User.name) private user: Model<User>,
    @InjectModel(Profile.name) private profile: Model<Profile>,
    private readonly otpService: OtpService,
    private readonly processService: ProcessService,
  ) { }

  // Initiates the registration process for a new user
  async startAuthenticationProcess(data: StartAuthDto) {
    // Extract and normalize the phone number
    const transformPhoneNumber = extractPhoneNumberInfo(data.phoneNumberIntl);
    console.log(transformPhoneNumber.intlNumber)

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
      message: `Your MSG ${findExistingUser ? 'Login' : 'Registration'} verification code is: \n ${createdOTP.substring(0, 3)}-${createdOTP.substring(3, 6)}`,
      phoneNumber: '+' + phoneId
    } as SmsMessage)


    if (findExistingUser) {
      const userProfile = await this.profile.findOne({ userId: findExistingUser._id })
      const caseToRun = data.verificationChannel !== null && data.verificationChannel.length > 0 ? data.verificationChannel : userProfile.defaultVerificationChannel;
      switch (caseToRun) {
        case MessageChannel.EMAIL:
          notifierEventData = new NotifierSingleChannelMessageEvent(MessageChannel.EMAIL, {
            emailAddresses: userProfile.email,
            subject: `${findExistingUser ? 'Login' : 'Registration'} verification code has been sent to your email`,
            template: 'verification_code',
            context: {
              code: createdOTP,
              user: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'John Doe',
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
    console.log(createdOTP)

    // TODO: Implement sending verification code logic
    return { message: 'Verification code sent successfully!' }
  }
}
