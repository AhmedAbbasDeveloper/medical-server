import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Medication, MedicationSchema } from './medication.schema';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Medication.name, schema: MedicationSchema },
    ]),
  ],
  controllers: [MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {}
