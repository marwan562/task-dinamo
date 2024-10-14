import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Body,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorService: VendorsService) {}

  // -------- Get All Vendors --------
  @Get()
  async getAllVendors() {
    return this.vendorService.findAll();
  }

  // -------- Get One Vendor by ID --------
  @Get(':id')
  async getVendorById(@Param('id') vendorId: string) {
    return this.vendorService.findOne(vendorId);
  }

  // -------- Update Vendor --------
  @Patch(':id')
  async updateVendor(
    @Param('id') vendorId: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorService.update(vendorId, updateVendorDto);
  }

  // -------- Remove Vendor --------
  @Delete(':id')
  async removeVendor(@Param('id') vendorId: string) {
    return this.vendorService.remove(vendorId);
  }
}
