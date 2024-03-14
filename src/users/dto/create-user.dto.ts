import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
  ValidateNested,
} from 'class-validator';
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from 'class-validator-password-check';

import { CreateContactInformationDto } from './create-contact-information.dto';

const passwordRequirement: PasswordValidationRequirement = {
  mustContainUpperLetter: true,
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
};

export class CreateUserDto {
  @Transform(({ value }) => value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;

  @ValidateNested()
  contactInformation: CreateContactInformationDto;

  @ValidateNested()
  emergencyContactInformation: CreateContactInformationDto;
}
