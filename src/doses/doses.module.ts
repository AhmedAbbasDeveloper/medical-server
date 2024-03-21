import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Dose, DoseSchema } from './dose.entity';
import { DosesController } from './doses.controller';
import { DosesService } from './doses.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dose.name, schema: DoseSchema }]),
  ],
  providers: [DosesService],
  controllers: [DosesController],
  exports: [DosesService],
})
export class DosesModule {}
