import { MiddlewareConsumer, Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vendor, VendorSchema } from './entities/vendor.entity';
import { Auth_Middleware } from 'src/common/middlewares/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product, ProductSchema } from 'src/products/entities/product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vendor.name, schema: VendorSchema },
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
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Auth_Middleware).forRoutes(VendorsController);
  }
}
