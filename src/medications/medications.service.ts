import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMedicationDto, UpdateMedicationDto } from './dto';
import { Medication, MedicationDocument } from './medication.schema';

import { DosesService } from '../doses/doses.service';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<MedicationDocument>,
    private readonly doseService: DosesService,
  ) {}

  async create(
    { dosage, times, ...createMedicationInput }: CreateMedicationDto,
    userId: string,
  ): Promise<Medication> {
    const medication = await this.medicationModel.create({
      ...createMedicationInput,
      userId,
    });

    times.forEach(async (time) => {
      await this.doseService.create(
        {
          time,
          dosage,
        },
        medication.id,
        userId,
      );
    });

    return medication;
  }

  async findAllFromUser(userId: string): Promise<Medication[]> {
    return this.medicationModel.find({ userId });
  }

  async findOneFromUser(id: string, userId: string): Promise<Medication> {
    return this.medicationModel.findOne({ _id: id, userId });
  }

  async updateOne(
    id: string,
    { quantityAdded }: UpdateMedicationDto,
    userId: string,
  ): Promise<Medication> {
    return this.medicationModel.findOneAndUpdate(
      { _id: id, userId },
      { $inc: { quantity: quantityAdded } },
      { new: true },
    );
  }

  async remove(id: string, userId: string): Promise<Medication | null> {
    return this.medicationModel.findOneAndDelete({ _id: id, userId });
  }
}
