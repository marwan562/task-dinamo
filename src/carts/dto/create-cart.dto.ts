import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCartDto {
  @IsMongoId()
  @IsNotEmpty()
  user: Types.ObjectId; 

  @IsMongoId({ each: true }) 
  @IsNotEmpty({ each: true }) 
  product: Types.ObjectId
}
