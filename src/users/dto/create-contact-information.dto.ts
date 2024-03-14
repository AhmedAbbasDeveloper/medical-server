import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactInformationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('CA')
  phoneNumber: string;
}
