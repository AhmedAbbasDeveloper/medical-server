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

import { CreateMedicationDto, UpdateMedicationDto } from './dto';
import { Medication } from './medication.schema';
import { MedicationsService } from './medications.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/user.schema';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

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
  @Get()
  async findAll(
    @CurrentUser() currentUser: Partial<User>,
  ): Promise<Medication[]> {
    return this.medicationsService.findAllFromUser(currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @CurrentUser() currentUser: Partial<User>,
    @Param('id') id: string,
  ): Promise<Medication> {
    return this.medicationsService.findOneFromUser(id, currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() currentUser: Partial<User>,
    @Param('id') id: string,
    @Body() updateMedicationInput: UpdateMedicationDto,
  ): Promise<Medication> {
    return this.medicationsService.updateOne(
      id,
      updateMedicationInput,
      currentUser.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @CurrentUser() currentUser: Partial<User>,
    @Param('id') id: string,
  ): Promise<Medication | null> {
    return this.medicationsService.remove(id, currentUser.id);
  }
}
