import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const user = await this.userModel.findById(createCartDto.user).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let cart = await this.cartModel
      .findOne({ user: createCartDto.user })
      .exec();
    if (!cart) {
      cart = new this.cartModel({ user: user._id, products: [] });
    }

    const product = await this.productModel
      .findById(createCartDto.product)
      .exec();
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createCartDto.product} not found`,
      );
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === product._id.toString(),
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({
        product: product._id as Types.ObjectId,
        quantity: 1,
      });
    }

    await cart.save();
    await user.updateOne({ $set: { cart: cart.products } });

    return cart;
  }

  async removeProduct(
    userId: string,
    productId: string,
  ): Promise<{ message: string }> {
    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId,
    );
    if (productIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    cart.products.splice(productIndex, 1);

    if (cart.products.length === 0) {
      await this.cartModel.deleteOne({ user: userId }).exec();
      await this.userModel.updateOne({ _id: userId }, { $unset: { cart: '' } });
      return { message: 'Cart is empty and has been removed' };
    }

    await user.updateOne({ $set: { cart: cart.products } });
    await cart.save();
    return { message: 'Product successfully removed from cart' };
  }

  async updateCart(
    userId: string,
    updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }

    const product = await this.productModel
      .findById(updateCartDto.product)
      .exec();
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${updateCartDto.product} not found`,
      );
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === product._id.toString(),
    );

    if (existingProductIndex > -1) {
      if (cart.products[existingProductIndex].quantity > 1) {
        cart.products[existingProductIndex].quantity -= 1;
      } else {
        cart.products.splice(existingProductIndex, 1);
      }
    } else {
      cart.products.push({
        product: product._id as Types.ObjectId,
        quantity: 1,
      });
    }

    if (cart.products.length === 0) {
      await this.cartModel.deleteOne({ user: userId }).exec();
      await this.userModel.updateOne({ _id: userId }, { $unset: { cart: '' } });
      return cart;
    }

    await user.updateOne({ $set: { cart: cart.products } });
    await cart.save();
    return cart;
  }
}
