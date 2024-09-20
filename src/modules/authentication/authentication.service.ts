import { ProcessType } from './../processes/enums/type.lib';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { StartLoginAuthDto } from './dto/login.dto';
import { LoginEvent } from './events/login.event';
import { ClientProxy } from '@nestjs/microservices';
import { StartRegistrationAuthDto } from './dto/start-registration.dto';
import { User } from '../user/models/user.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { extractPhoneNumberInfo, normalizePhoneNumber } from 'src/utils/helpers';
import { OtpService } from '../otp/otp.service';
import { ProcessService } from '../processes/process.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('LANG_CHAIN_SERVICE') private readonly langChainService: ClientProxy,
    @InjectModel(User.name) private user: Model<User>,
    private readonly otpService: OtpService,
    private readonly processService: ProcessService,
  ) { }

  // Handles user login
  login(data: StartLoginAuthDto) {
    console.log(data)
    // Emit a 'loggedin' event to the language chain service
    this.langChainService.emit('loggedin', new LoginEvent(data.email))
    // TODO: Implement actual login logic
    return 'This action adds a new authentication';
  }

  // Initiates the registration process for a new user
  async startRegistrationProcess(data: StartRegistrationAuthDto) {
    // Extract and normalize the phone number
    const transformPhoneNumber = extractPhoneNumberInfo(data.phoneNumberIntl);
    console.log(transformPhoneNumber.intlNumber)

    const phoneId = transformPhoneNumber.intlNumber

    // Check if a user with this phone number already exists
    const findExistingUser = await this.user.findOne({ phoneId })
    console.log(findExistingUser)
    if (findExistingUser) {
      throw new BadRequestException('User already exists');
    }

    const authProcessData = await this.processService.create({
      phoneId,
      type: ProcessType.Auth
    })

    const createdOTP = await this.otpService.create({
      processId: authProcessData._id.toString(),
    })

    console.log(createdOTP)

    // TODO: Implement sending verification code logic
    return { message: 'Verification code sent successfully!', data: {} }
  }
}
