import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMedicationDto, UpdateMedicationDto } from './dto';
import { Medication, MedicationDocument } from './medication.schema';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<MedicationDocument>,
  ) {}

  async create(
    createMedicationInput: CreateMedicationDto,
    userId: string,
  ): Promise<Medication> {
    return this.medicationModel.create({ ...createMedicationInput, userId });
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