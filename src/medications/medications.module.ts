import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Medication, MedicationSchema } from './medication.schema';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

import { DosesModule } from '../doses/doses.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medication.name, schema: MedicationSchema },
    ]),
    DosesModule,
    NotificationsModule,
    UsersModule,
  ],
  providers: [MedicationsService],
  controllers: [MedicationsController],
  exports: [MedicationsService],
})
export class MedicationsModule {}
