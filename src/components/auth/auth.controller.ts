import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailDTO } from 'src/dto/email/email.dto';
import { OtpEmailDto } from 'src/dto/otp/otpEmail.dto';
import { IsEmailExistsDTO } from 'src/dto/user/is-email-exists.dto';
import { SignUpCustomerDTO } from 'src/dto/user/signupcustomer.dto';

import { LoginDto } from '../../dto/user/login.dto';
import { SignUpDTO } from '../../dto/user/signup.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Get('login/:email/:password')
  loginToken(
    @Param('email') email: string,
    @Param('password') password: string,
  ) {
    if (email == 'test@gmail.com' && password == 'test@123') {
      return this._authService.loginToken();
    } else {
      return new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this._authService.login(loginDto);
  }

  @Post('loginCustomer')
  loginCustomer(@Body() loginDto: LoginDto) {
    return this._authService.loginCustomer(loginDto);
  }

  @Post('loginAdmin')
  loginAdmin(@Body() loginDto: LoginDto) {
    return this._authService.loginAdmin(loginDto);
  }

  @Post('signup')
  signup(@Body() signupDto: SignUpDTO) {
    return this._authService.signup(signupDto);
  }

  @Post('signupCustomer')
  signupUser(@Body() signupUserDto: SignUpCustomerDTO) {
    return this._authService.signupCustomer(signupUserDto);
  }

  @Post('sendEmail')
  sendEmail(@Body() emailDto: EmailDTO) {
    return this._authService.sendMail(emailDto);
  }

  @Post('/isEmailExists')
  isEmailExists(@Body() isEmailExistsDto: IsEmailExistsDTO) {
    return this._authService.isEmailExists(isEmailExistsDto.email);
  }

  @Post('/isEmailExistsForCustomerPanel')
  isEmailExistsForCustomerPanel(@Body() isEmailExistsDto: IsEmailExistsDTO) {
    return this._authService.isEmailExistsForCustomerPanel(
      isEmailExistsDto.email,
    );
  }

  @Post('/sendOtp')
  sendOtp(@Body() emailDto: OtpEmailDto) {
    return this._authService.sendOtp(emailDto);
  }

  @Post('/verifyOtp/:otp')
  verifyOtp(@Param('otp') otp: number) {
    return this._authService.verifyOtp(otp);
  }

  @Post('loginForCRM')
  loginForCRM(@Body() loginDto: LoginDto) {
    return this._authService.loginForCRM(loginDto);
  }
}
