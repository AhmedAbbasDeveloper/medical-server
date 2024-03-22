import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Dose } from './dose.entity';
import { DosesService } from './doses.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../users/user.schema';

@Controller('doses')
export class DosesController {
  constructor(private readonly dosesService: DosesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllFromUser(
    @CurrentUser() currentUser: Partial<User>,
  ): Promise<Dose[]> {
    return this.dosesService.findAllFromUser(currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOneFromUser(
    @CurrentUser() currentUser: Partial<User>,
    @Param('id') id: string,
  ): Promise<Dose> {
    return this.dosesService.findOneFromUser(id, currentUser.id);
  }
}
