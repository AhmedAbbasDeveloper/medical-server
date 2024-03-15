import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { User } from '../users/user.schema';

export type MedicationDocument = HydratedDocument<Medication>;

@Schema({ timestamps: true })
export class Medication {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  bucket: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  createdAt: Date;

  updatedAt: Date;
}

export const MedicationSchema = SchemaFactory.createForClass(Medication);
