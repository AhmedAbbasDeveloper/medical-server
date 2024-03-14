import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ContactInformation {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const ContactInformationSchema =
  SchemaFactory.createForClass(ContactInformation);
