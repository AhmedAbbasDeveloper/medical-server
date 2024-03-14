import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateMedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;
}
