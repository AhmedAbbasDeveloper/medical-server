import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  ContactInformation,
  ContactInformationSchema,
} from './contact-information.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: ContactInformationSchema })
  contactInformation: ContactInformation;

  @Prop({ required: true, type: ContactInformationSchema })
  emergencyContactInformation: ContactInformation;

  @Prop({ required: false })
  deviceToken: string;

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
