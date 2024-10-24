import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { StartAuthDto } from './dto/start-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';
import { FinishAuthDto } from './dto/finish-auth.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('start')
  startAuthProcess(@Body() data: StartAuthDto) {
    return this.authenticationService.startAuthenticationProcess(data)
  }

  @Post('verify')
  verifyAuthProcess(@Body() data: VerifyAuthDto) {
    return this.authenticationService.verifyAuthenticationProcess(data)
  }

  @Post('finish')
  finishAuthProcess(@Body() data: FinishAuthDto) {
    return this.authenticationService.finishAuthenticationProcess(data)
  }
}
