import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  @Post()
  async createCart(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return await this.cartService.create(createCartDto);
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    return await this.cartService.updateCart(userId, updateCartDto);
  }

  @Delete('remove-product/:userId/:productId')
  async removeProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<{ message: string }> {
    return await this.cartService.removeProduct(userId, productId);
  }
}
