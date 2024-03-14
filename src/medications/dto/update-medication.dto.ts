import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateMedicationDto {
  @IsNotEmpty()
  @IsPositive()
  quantityAdded: number;
}
