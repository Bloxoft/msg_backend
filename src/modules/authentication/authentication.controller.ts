import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { StartLoginAuthDto } from './dto/login.dto';
import { StartRegistrationAuthDto } from './dto/start-registration.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  // registration conroller
  @Post('registration/start')
  startRegistrationProcess(@Body() data: StartRegistrationAuthDto) {
    return this.authenticationService.startRegistrationProcess(data);
  }

  // login controller
  @Post('login')
  login(@Body() data: StartLoginAuthDto) {
    return this.authenticationService.login(data);
  }

}
