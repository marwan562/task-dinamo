import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Vendor } from 'src/vendors/entities/vendor.entity';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ type:mongoose.Schema.Types.ObjectId, ref: 'Vendor' })
  vendor: Vendor;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
