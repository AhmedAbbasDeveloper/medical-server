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
    const bucket = await this.getNextAvailableBucket(userId);
    createMedicationInput.bucket = bucket;

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

  async delete(id: string, userId: string): Promise<Medication | null> {
    await this.doseService.deleteAllFromMedication(id, userId);
    return this.medicationModel.findOneAndDelete({ _id: id, userId });
  }

  private async getNextAvailableBucket(userId: string): Promise<number> {
    const existingMedications = await this.findAllFromUser(userId);

    const buckets = new Set(
      existingMedications.map(
        (existingMedication) => existingMedication.bucket,
      ),
    );

    for (let i = 1; i <= 5; i++) {
      if (!buckets.has(i)) {
        return i;
      }
    }

    throw new Error('All buckets are already in use.');
  }
}
