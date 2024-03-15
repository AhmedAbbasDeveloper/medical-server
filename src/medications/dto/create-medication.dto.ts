import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsPositive()
  dosage: number;

  @Type(() => Date)
  @IsArray()
  @IsDate({ each: true })
  @ValidateNested({ each: true })
  times: Date[];

  bucket?: number;
}
