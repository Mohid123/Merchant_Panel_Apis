import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UsersInterface } from '../../interface/user/users.interface';
import { EmailDTO } from '../../dto/email/email.dto';
import { OTP } from 'src/interface/otp/otp.interface';
export declare class AuthService {
    private readonly _usersService;
    private readonly _otpService;
    private jwtService;
    constructor(_usersService: Model<UsersInterface>, _otpService: Model<OTP>, jwtService: JwtService);
    onModuleInit(): void;
    loginToken(): Promise<{
        access_token: string;
    }>;
    private generateToken;
    loginForCRM(loginDto: any): Promise<{
        token: string;
    }>;
    login(loginDto: any): Promise<{
        user: import("mongoose").Document<unknown, any, UsersInterface> & UsersInterface & {
            _id: string;
        };
        token: string;
    }>;
    generatePassword(): Promise<any>;
    signup(loginDto: any): Promise<import("mongoose").Document<unknown, any, UsersInterface> & UsersInterface & {
        _id: string;
    }>;
    sendMail(emailDto: EmailDTO): Promise<void>;
    isEmailExists(email: any): Promise<boolean>;
    sendOtp(otpEmailDto: any): Promise<{
        message: string;
    }>;
    verifyOtp(userOtp: any): Promise<{
        message: string;
        token: string;
    }>;
}
