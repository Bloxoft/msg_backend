import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authentication/authentication.guard';
import { Contact } from './classes/contact';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('check-username')
  startAuthProcess(@Body() data: { username: String }) {
    return this.userService.checkUsernameStatus(data.username)
  }

  @UseGuards(AuthGuard)
  @Post('check-contacts')
  checkProfileWithContactsList(@Request() req, @Body() data: Contact[]) {
    return this.userService.checkUsersFromContactsList(data, req.user)
  }
}
