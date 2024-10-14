import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Vendor } from 'src/vendors/entities/vendor.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
  ) {}

  // -------- Create a Product --------
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel({
      ...createProductDto,
    });

    await newProduct.save();

    const vendor = await this.vendorModel.findById(createProductDto.vendor);

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    await vendor.updateOne({
      $push: { products: newProduct._id },
    });

    return newProduct;
  }

  // -------- Get All Products --------
  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('vendor').exec();
  }

  // -------- Get One Product by ID --------
  async findOne(productId: string): Promise<Product> {
    const product = await this.productModel
      .findById(productId)
      .populate('vendor')
      .exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return product;
  }

  // -------- Update Product --------
  async update(
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(productId, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return updatedProduct;
  }

  // -------- Remove Product --------
  async remove(productId: string): Promise<{ message: string }> {
    const product = await this.productModel.findByIdAndDelete(productId).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    await this.vendorModel.findByIdAndUpdate(product.vendor, {
      $pull: { products: product._id },
    });

    return { message: 'Product successfully deleted' };
  }
}
