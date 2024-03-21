import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Medication, MedicationSchema } from './medication.schema';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

import { DosesModule } from '../doses/doses.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medication.name, schema: MedicationSchema },
    ]),
    DosesModule,
  ],
  providers: [MedicationsService],
  controllers: [MedicationsController],
})
export class MedicationsModule {}
