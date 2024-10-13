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

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('NOTIFIER_SERVICE') private notifier: ClientProxy,
    @InjectModel(User.name) private user: Model<User>,
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
      processId: authProcessData._id.toString(),
    })

    // send notification to required channel
    this.notifier.emit('singleChannelMessage', new NotifierSingleChannelMessageEvent(MessageChannel.EMAIL, {
      emails: ['ulimhunyieagbama@gmail.com'],
      subject: 'Hello there'
    } as EmailMessage))

    console.log(createdOTP)

    // TODO: Implement sending verification code logic
    return { message: 'Verification code sent successfully!' }
  }
}
