import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';

import { CreateMedicationDto, UpdateMedicationDto } from './dto';
import { Medication, MedicationDocument } from './medication.schema';

import { Dose } from '../doses/dose.entity';
import { DosesService } from '../doses/doses.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name)
    private readonly medicationModel: Model<MedicationDocument>,
    private readonly doseService: DosesService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async findAllFromUser(userId: string): Promise<Medication[]> {
    return this.medicationModel.find({ userId });
  }

  async findOne(id: string): Promise<Medication> {
    return this.medicationModel.findById(id);
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
    const medication = await this.findOne(dose.medicationId.toString());

    try {
      for (let i = 0; i < dose.dosage; i++) {
        await axios.get(`http://192.48.56.2/${medication.bucket}`);
      }
    } catch (error) {
      console.log(error);
    }

    await this.decrementQuantity(medication.id, dose.dosage);

    return dose;
  }

  async notifyUser(dose: Dose): Promise<void> {
    const medication = await this.findOne(dose.medicationId.toString());
    const user = await this.usersService.findOne(medication.userId.toString());

    await this.notificationsService.sendPushNotification({
      title: 'Time to take your medication!',
      body: `It's time to take your ${medication.name} dose. Please take ${dose.dosage} now.`,
      deviceToken: user.deviceToken,
    });
  }
}
