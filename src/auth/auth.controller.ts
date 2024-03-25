import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

import { CurrentUser } from '../decorators/user.decorator';
import { CreateUserDto } from '../users/dto';
import { User } from '../users/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() currentUser: Partial<User>,
  ): Promise<AccessTokenDto> {
    return this.authService.login(currentUser);
  }

  @Post('register')
  async register(
    @Body()
    {
      email,
      password,
      contactInformation,
      emergencyContactInformation,
    }: CreateUserDto,
  ): Promise<AccessTokenDto> {
    try {
      const accessToken = await this.authService.register({
        email,
        password,
        contactInformation,
        emergencyContactInformation,
      });
      return accessToken;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('device-token')
  async updateDeviceToken(
    @CurrentUser() currentUser: Partial<User>,
    @Body('deviceToken') deviceToken: string,
  ): Promise<Partial<User>> {
    return this.authService.updateDeviceToken(currentUser.id, deviceToken);
  }
}
