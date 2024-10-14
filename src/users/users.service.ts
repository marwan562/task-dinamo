import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // -------- Get All Users --------
  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('cart').exec();
  }

  // -------- Get One User by ID --------
  async findOne(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).populate("cart.product").exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // -------- Update User --------
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return updatedUser;
  }

  // -------- Remove User --------
  async remove(userId: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return { message: 'User successfully deleted' };
  }
}
