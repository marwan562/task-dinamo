import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { SignUpUserDTO } from './dto/singup-user.dto';
import { SignInUserDTO } from './dto/singin-user.dto';
import { SignUpVendorDTO } from './dto/signup-vendor.dto';
import { SignInVendorDTO } from './dto/signin-vendor.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
    private jwtService: JwtService,
  ) {}

  // -------- Sign-Up Logic for User --------
  async signUpUser(
    createUserDto: SignUpUserDTO,
  ): Promise<{ user: User; token: string }> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or username already exists',
      );
    }

    const newUser = new this.userModel({
      username,
      email,
      password,
    });

    await newUser.save();

    const token = this.jwtService.sign({ userId: newUser._id });

    return { user: newUser, token };
  }

  // -------- Sign-In Logic for User --------
  async signInUser(
    signInUserDTO: SignInUserDTO,
  ): Promise<{ user: User; token: string }> {
    const { email, password } = signInUserDTO;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ userId: user._id });

    return { user, token };
  }

  // -------- Sign-Up Logic for Vendor --------
  async signUpVendor(
    signUpVendorDTO: SignUpVendorDTO,
  ): Promise<{ vendor: Vendor; token: string }> {
    const { email } = signUpVendorDTO;

    const existingVendor = await this.vendorModel.findOne({ email });
    if (existingVendor) {
      throw new BadRequestException('Vendor with this email already exists');
    }

    const newVendor = new this.vendorModel({
      ...signUpVendorDTO,
    });

    await newVendor.save();

    const token = this.jwtService.sign({ vendorId: newVendor._id });

    return { vendor: newVendor, token };
  }

  // -------- Sign-In Logic for Vendor --------
  async signInVendor(
    signInVendorDTO: SignInVendorDTO,
  ): Promise<{ vendor: Vendor; token: string }> {
    const { email, password } = signInVendorDTO;
    
    const vendor =  await this.vendorModel.findOne({ email }).populate("products");

    if (!vendor) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ vendorId: vendor._id });

    return { vendor, token };
  }
}
