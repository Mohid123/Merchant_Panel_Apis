import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UsersInterface } from '../../interface/user/users.interface';
export declare class AuthService {
    private readonly _usersService;
    private jwtService;
    constructor(_usersService: Model<UsersInterface>, jwtService: JwtService);
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
    signup(loginDto: any): Promise<import("mongoose").Document<unknown, any, UsersInterface> & UsersInterface & {
        _id: string;
    }>;
}
