import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { StartLoginAuthDto } from './dto/login.dto';
import { ClientProxy } from '@nestjs/microservices';
import { LoginEvent } from './events/login.event';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService, @Inject('LANG_CHAIN_SERVICE') private readonly langChainService: ClientProxy) { }

  @Post('login')
  login(@Body() data: StartLoginAuthDto) {
    return this.authenticationService.login(data);
  }

}
