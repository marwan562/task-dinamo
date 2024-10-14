import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDTO } from './dto/singup-user.dto';
import { SignInUserDTO } from './dto/singin-user.dto';
import { SignUpVendorDTO } from './dto/signup-vendor.dto';
import { SignInVendorDTO } from './dto/signin-vendor.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------Auth User----------

  @Post('signup/user')
  async signUpUser(@Body() signUpUserDTO: SignUpUserDTO) {
    return this.authService.signUpUser(signUpUserDTO);
  }

  @Post('signin/user')
  async signInUser(@Body() signInUserDTO: SignInUserDTO) {
    return this.authService.signInUser(signInUserDTO);
  }

  // ---------Auth Vendor----------

  @Post('signup/vendor')
  async signUpVendor(@Body() signUpVendorDTO: SignUpVendorDTO) {
    return this.authService.signUpVendor(signUpVendorDTO);
  }

  @Post('signin/vendor')
  async signInVendor(
    @Body() signInVendorDTO: SignInVendorDTO,
   
  ) {
    return this.authService.signInVendor(signInVendorDTO);
  }
}
