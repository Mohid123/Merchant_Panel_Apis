/// <reference types="mongoose" />
import { HttpException } from '@nestjs/common';
import { LoginDto } from 'src/dto/user/login.dto';
import { SignUpDTO } from 'src/dto/user/signup.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly _authService;
    constructor(_authService: AuthService);
    loginToken(email: string, password: string): HttpException | Promise<{
        access_token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: import("mongoose").Document<unknown, any, import("../../interface/user/users.interface").UsersInterface> & import("../../interface/user/users.interface").UsersInterface & {
            _id: string;
        };
        token: string;
    }>;
    signup(signupDto: SignUpDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/user/users.interface").UsersInterface> & import("../../interface/user/users.interface").UsersInterface & {
        _id: string;
    }>;
}
