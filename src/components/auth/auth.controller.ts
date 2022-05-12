import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EmailDTO } from 'src/dto/email/email.dto';
import { LoginDto } from '../../dto/user/login.dto';
import { SignUpDTO } from '../../dto/user/signup.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly _authService:AuthService) {}

    @Get('login/:email/:password')
    loginToken (
        @Param('email') email:string,
        @Param('password') password: string) {
            if(email =='test@gmail.com' && password == 'test@123'){
                return this._authService.loginToken();
            }
            else{
                return new HttpException('Forbidden',HttpStatus.FORBIDDEN);
            }
        }
    
    @Post('login')
    login(@Body() loginDto : LoginDto ){
        return this._authService.login(loginDto);
    }
    
    @Post('signup')
    signup(@Body() signupDto: SignUpDTO){
        return this._authService.signup(signupDto)
    }
    
    @Post('sendEmail')
      sendEmail(@Body() emailDto:EmailDTO){
        return this._authService.sendMail(emailDto)
    }
}
