import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async create({
    email,
    password,
    contactInformation,
    emergencyContactInformation,
  }: CreateUserDto): Promise<User> {
    return this.userModel.create({
      email,
      password,
      contactInformation,
      emergencyContactInformation,
    });
  }

  async updateDeviceToken(id: string, deviceToken: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, { deviceToken }, { new: true });
  }
}
