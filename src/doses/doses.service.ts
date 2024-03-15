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

  async create(
    createDoseInput: CreateDoseDto,
    medicationId: string,
    userId: string,
  ): Promise<Dose> {
    return this.doseModel.create({ ...createDoseInput, medicationId, userId });
  }

  async findAllFromUser(userId: string): Promise<Dose[]> {
    const doses: (Dose & { timeDifference?: number })[] =
      await this.doseModel.find({ userId });

    const currentTime = new Date();

    doses.forEach((dose) => {
      const doseTime = new Date(dose.time);
      let timeDifference = doseTime.getTime() - currentTime.getTime();

      if (timeDifference < 0) {
        timeDifference += 24 * 60 * 60 * 1000;
      }

      dose.timeDifference = timeDifference;
    });

    doses.sort((a, b) => a.timeDifference - b.timeDifference);

    return doses.map((dose) => {
      delete dose.timeDifference;
      return dose;
    });
  }

  async findOneFromUser(id: string, userId: string): Promise<Dose> {
    return this.doseModel.findOne({ _id: id, userId });
  }
}
