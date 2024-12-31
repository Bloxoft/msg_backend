import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authentication/authentication.guard';
import { Contact } from './classes/contact';
import { AddDeviceDto } from './dto/add-device.dto';

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


  // device management controllers
  @UseGuards(AuthGuard)
  @Post('device-mgt/add')
  addOrUpdateUserDevice(@Request() req, @Body() data: AddDeviceDto) {
    return this.userService.addOrUpdateDevice(data, req.user)
  }

  @UseGuards(AuthGuard)
  @Delete('device-mgt/remove/:deviceId')
  removeUserFromDevice(@Request() req, @Param('deviceId') id: string) {
    return this.userService.removeUserFromDevice(id, req.user)
  }


  @UseGuards(AuthGuard)
  @Get('device-mgt/validate-session/:deviceId')
  validateUserSession(@Request() req, @Param('deviceId') id: string) {
    return this.userService.validateDeviceSession(id, req.user)
  }


}
