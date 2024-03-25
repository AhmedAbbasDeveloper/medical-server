import { Controller, Post, UseGuards } from '@nestjs/common';

import { NotificationsService } from './notifications.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('send_test')
  async test(@CurrentUser() currentUser: Partial<User>): Promise<any> {
    const user = await this.usersService.findOne(currentUser.id);
    await this.notificationsService.sendPushNotification({
      title: 'Test Notification',
      body: 'This is a test notification',
      deviceToken: user.deviceToken,
    });
  }
}
