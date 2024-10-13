import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { StartAuthDto } from './dto/start-auth.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('start')
  startAuthProcess(@Body() data: StartAuthDto) {
    return this.authenticationService.startAuthenticationProcess(data)
  }
}
