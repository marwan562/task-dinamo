import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './entities/vendor.entity';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

  // -------- Get All Vendors --------
  async findAll(): Promise<Vendor[]> {
    return this.vendorModel.find().populate(['products']).exec();
  }

  // -------- Get One Vendor by ID --------
  async findOne(vendorId: string): Promise<Vendor> {
    const vendor = await this.vendorModel
      .findById(vendorId)
      .populate('products')
      .exec()
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }
    return vendor;
  }

  // -------- Update Vendor --------
  async update(
    vendorId: string,
    updateVendorDto: UpdateVendorDto,
  ): Promise<Vendor> {
    const updatedVendor = await this.vendorModel.findByIdAndUpdate(
      vendorId,
      updateVendorDto,
      { new: true },
    );

    if (!updatedVendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }
    return updatedVendor;
  }

  // -------- Remove Vendor --------
  async remove(vendorId: string): Promise<{ message: string }> {
    const deletedVendor = await this.vendorModel.findByIdAndDelete(vendorId);

    if (!deletedVendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }
    return { message: 'Vendor successfully deleted' };
  }
}
