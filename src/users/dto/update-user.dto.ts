import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEmail, IsString } from 'class-validator';

export class UpdateUser {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  cart?: string;  
}

export class UpdateUserDto extends PartialType(UpdateUser) {}
