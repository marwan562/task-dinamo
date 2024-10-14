import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString, IsEmail } from 'class-validator';

class UpdateVendor {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    products?: string[]; 
}

export class UpdateVendorDto extends PartialType(UpdateVendor) {}
