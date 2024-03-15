import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Medication } from '../medications/medication.schema';
import { User } from '../users/user.schema';

export type DoseDocument = HydratedDocument<Dose>;

@Schema({ timestamps: true })
export class Dose {
  id: string;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  dosage: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Medication',
    required: true,
  })
  medicationId: Medication;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User;

  createdAt: Date;

  updatedAt: Date;
}

export const DoseSchema = SchemaFactory.createForClass(Dose);
