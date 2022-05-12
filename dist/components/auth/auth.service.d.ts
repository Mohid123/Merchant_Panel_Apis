import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UsersInterface } from '../../interface/user/users.interface';
import { EmailDTO } from '../../dto/email/email.dto';
export declare class AuthService {
    private readonly _usersService;
    private jwtService;
    constructor(_usersService: Model<UsersInterface>, jwtService: JwtService);
    onModuleInit(): void;
    loginToken(): Promise<{
        access_token: string;
    }>;
    private generateToken;
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
}
