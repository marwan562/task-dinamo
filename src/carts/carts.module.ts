import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { Cart, CartSchema } from './entities/cart.entity';
import { JwtModule } from '@nestjs/jwt';
import { Auth_Middleware } from 'src/common/middlewares/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Product, ProductSchema } from 'src/products/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_JWT'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Auth_Middleware).forRoutes(CartsController);
  }
}
