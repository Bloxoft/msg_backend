import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authentication/authentication.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('check-username')
  startAuthProcess(@Body() data: { username: String }) {
    return this.userService.checkUsernameStatus(data.username)
  }
}
