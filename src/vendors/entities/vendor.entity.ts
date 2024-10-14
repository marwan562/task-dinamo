import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/products/entities/product.entity';

@Schema({ timestamps: true })
export class Vendor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  products: Product[];
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);

VendorSchema.pre('save', async function (next) {
  const vendor = this as Vendor;
  if (!vendor.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  vendor.password = await bcrypt.hash(vendor.password, salt);
  next();
});
