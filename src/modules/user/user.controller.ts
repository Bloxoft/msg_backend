import { SaveUserLastSessionDto } from './dto/save-last-session.dto';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../authentication/authentication.guard';
import { Contact } from './classes/contact';
import { AddDeviceDto } from './dto/add-device.dto';
import { RemoveMultipleDevicesDto } from './dto/remove-multiple-devices.dto';

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
    return this.userService.removeUserFromDevice([id], req.user)
  }
  @UseGuards(AuthGuard)
  @Post('device-mgt/remove-multiple')
  removeUMultipleUserSessionsFromDevices(@Request() req, @Body() data: RemoveMultipleDevicesDto) {
    return this.userService.removeUserFromDevice(data.devices, req.user)
  }


  @UseGuards(AuthGuard)
  @Get('device-mgt/validate-session/:deviceId')
  validateUserSession(@Request() req, @Param('deviceId') id: string) {
    return this.userService.validateDeviceSession(id, req.user)
  }

  @UseGuards(AuthGuard)
  @Put('device-mgt/save-last-session')
  SaveUserLastSession(@Request() req, @Body() data: SaveUserLastSessionDto) {
    return this.userService.saveLastUserSession(data, req.user)
  }


}
