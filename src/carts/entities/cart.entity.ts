import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true }) 
  user:Types.ObjectId

  @Prop([{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
    quantity: { type: Number, required: true }
  }])
  products: { product: Types.ObjectId; quantity: number }[];  
}

export const CartSchema = SchemaFactory.createForClass(Cart);
