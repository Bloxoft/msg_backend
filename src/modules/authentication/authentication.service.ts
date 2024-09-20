import { Inject, Injectable } from '@nestjs/common';
import { StartLoginAuthDto } from './dto/login.dto';
import { LoginEvent } from './events/login.event';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthenticationService {
  constructor(@Inject('LANG_CHAIN_SERVICE') private readonly langChainService: ClientProxy) { }
  login(data: StartLoginAuthDto) {
    console.log(data)
    this.langChainService.emit('loggedin', new LoginEvent(data.email))
    return 'This action adds a new authentication';
  }
}
