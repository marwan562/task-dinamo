import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsMongoId,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsMongoId()
  vendor: string;
}
