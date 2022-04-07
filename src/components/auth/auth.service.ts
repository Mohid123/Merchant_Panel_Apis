import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersInterface } from 'src/interface/user/users.interface';

@Injectable()
export class AuthService {
    constructor(@InjectModel('User') private readonly _usersService: Model<UsersInterface>,
    private jwtService:JwtService) {}
    
    async loginToken() {
        const userData = {
            id: '6130c471434e4e306484e31c',
            email: "haider@gmail.com",
            admin: true
        }
        return this.generateToken(userData)
    }

    private generateToken(payload) {
        return {
            access_token: `Bearer ${this.jwtService.sign(payload)}`
        }
    }

    async login(loginDto) {
        let user = await this._usersService.findOne({ email: loginDto.email });

        if (!user) {
            throw new UnauthorizedException('Incorrect credentials');
        }

        const isValidCredentials = await bcrypt.compare(loginDto.password,user.password);

        if(!isValidCredentials){
            throw new UnauthorizedException('Incorrect credentials');
        }
        user = JSON.parse(JSON.stringify(user));

        delete user.password;

        const token = this.generateToken(user);

        return { user, token: token.access_token };
    }

    async signup(loginDto) {
        let user = await this._usersService.findOne({ email: loginDto.email });
        if (user) {
            throw new ForbiddenException("Email already exists");
            return;
        }
        loginDto._id = new Types.ObjectId().toString();

        return await new this._usersService(loginDto).save()
    }

}
