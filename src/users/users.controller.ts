import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // -------- Get All Users --------
  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  // -------- Get One User by ID --------
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    console.log(id)
    return this.userService.findOne(id);
  }

  // -------- Update User --------
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // -------- Remove User --------
  @Delete(':id')
  async removeUser(@Param('id' ) id: string) {
    return this.userService.remove(id);
  }
}
