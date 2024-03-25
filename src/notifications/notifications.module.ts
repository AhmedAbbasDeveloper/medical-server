import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

import { DosesModule } from '../doses/doses.module';
import { MedicationsModule } from '../medications/medications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DosesModule, MedicationsModule, UsersModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
