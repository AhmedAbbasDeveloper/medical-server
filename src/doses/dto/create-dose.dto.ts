import { IsDate, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateDoseDto {
  @IsNotEmpty()
  @IsDate()
  time: Date;

  @IsNotEmpty()
  @IsPositive()
  dosage: number;
}
