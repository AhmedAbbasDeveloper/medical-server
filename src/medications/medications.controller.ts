import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CreateMedicationDto, UpdateMedicationDto } from './dto';
import { Medication } from './medication.schema';
import { MedicationsService } from './medications.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { Dose } from '../doses/dose.entity';
import { DosesService } from '../doses/doses.service';
import { User } from '../users/user.schema';

@Controller('medications')
export class MedicationsController {
  constructor(
    private readonly medicationsService: MedicationsService,
    private readonly dosesService: DosesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllFromUser(
    @CurrentUser() currentUser: Partial<User>,
  ): Promise<Medication[]> {
    return this.medicationsService.findAllFromUser(currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneFromUser(
    @CurrentUser() currentUser: Partial<User>,
    @Param('id') id: string,
  ): Promise<Medication> {
    return this.medicationsService.findOneFromUser(id, currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() currentUser: Partial<User>,
    @Body() createMedicationInput: CreateMedicationDto,
  ): Promise<Medication> {
    try {
      const medication = await this.medicationsService.create(
        createMedicationInput,
        currentUser.id,
      );
      return medication;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() currentUser: Partial<User>,
    @Param('id') id: string,
    @Body() updateMedicationInput: UpdateMedicationDto,
  ): Promise<Medication> {
    return this.medicationsService.update(
      id,
      updateMedicationInput,
      currentUser.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @CurrentUser() currentUser: Partial<User>,
    @Param('id') id: string,
  ): Promise<Medication | null> {
    return this.medicationsService.delete(id, currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('dispense/dose/:doseId')
  async dispsense(
    @CurrentUser() currentUser: Partial<User>,
    @Param('doseId') doseId: string,
  ): Promise<Dose | null> {
    return this.medicationsService.dispense(doseId, currentUser.id);
  }

  @Cron('0 * * * * *')
  async sendNotifications(): Promise<void> {
    const doses = await this.dosesService.findAllNow();

    for (const dose of doses) {
      await this.medicationsService.notifyUser(dose);
    }
  }
}
