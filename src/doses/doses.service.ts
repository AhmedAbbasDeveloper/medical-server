import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Dose, DoseDocument } from './dose.entity';
import { CreateDoseDto } from './dto';

@Injectable()
export class DosesService {
  constructor(
    @InjectModel(Dose.name) private readonly doseModel: Model<DoseDocument>,
  ) {}

  async findAllFromUser(userId: string): Promise<Dose[]> {
    const doses: (Dose & { timeDifference?: number })[] =
      await this.doseModel.find({ userId });

    const currentTime = new Date();
    const currentTimeInMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    doses.forEach((dose) => {
      const doseTimeInMinutes =
        dose.time.getHours() * 60 + dose.time.getMinutes();

      let timeDifference = doseTimeInMinutes - currentTimeInMinutes;

      if (timeDifference < 0) {
        timeDifference += 24 * 60 * 60;
      }

      dose.timeDifference = timeDifference;
    });

    doses.sort((a, b) => a.timeDifference - b.timeDifference);

    return doses.map((dose) => {
      dose.timeDifference = undefined;
      return dose;
    });
  }

  async findOneFromUser(id: string, userId: string): Promise<Dose> {
    return this.doseModel.findOne({ _id: id, userId });
  }

  async findAllNow(): Promise<Dose[]> {
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();

    const doses = await this.doseModel.find({
      $expr: {
        $and: [
          { $eq: [{ $hour: '$time' }, hour] },
          { $eq: [{ $minute: '$time' }, minute] },
        ],
      },
    });

    return doses;
  }

  async create(
    createDoseInput: CreateDoseDto,
    medicationId: string,
    userId: string,
  ): Promise<Dose> {
    return this.doseModel.create({ ...createDoseInput, medicationId, userId });
  }

  async deleteAllFromMedication(
    medicationId: string,
    userId: string,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> {
    return this.doseModel.deleteMany({ medicationId, userId });
  }
}
