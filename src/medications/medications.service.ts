import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';

import { CreateMedicationDto, UpdateMedicationDto } from './dto';
import { Medication, MedicationDocument } from './medication.schema';

import { Dose } from '../doses/dose.entity';
import { DosesService } from '../doses/doses.service';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<MedicationDocument>,
    private readonly doseService: DosesService,
  ) {}

  async findAllFromUser(userId: string): Promise<Medication[]> {
    return this.medicationModel.find({ userId });
  }

  async findOneFromUser(id: string, userId: string): Promise<Medication> {
    return this.medicationModel.findOne({ _id: id, userId });
  }

  async create(
    { dosage, times, ...createMedicationInput }: CreateMedicationDto,
    userId: string,
  ): Promise<Medication> {
    createMedicationInput.bucket = await this.getNextAvailableBucket(userId);

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

  async update(
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

  async decrementQuantity(
    id: string,
    quantityConsumed: number,
  ): Promise<Medication> {
    return this.medicationModel.findOneAndUpdate(
      { _id: id },
      { $inc: { quantity: -quantityConsumed } },
      { new: true },
    );
  }

  async dispense(doseId: string, userId: string): Promise<Dose | null> {
    const dose = await this.doseService.findOneFromUser(doseId, userId);
    const medication = await this.findOneFromUser(
      dose.medicationId.toString(),
      userId,
    );

    await this.decrementQuantity(medication.id, dose.dosage);

    try {
      for (let i = 0; i < dose.dosage; i++) {
        await axios.get(`http://192.48.56.2/${medication.bucket}`);
      }
      return dose;
    } catch (error) {
      console.log(error);
    }
  }
}
