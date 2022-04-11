/// <reference types="mongoose" />
import { UsersDto } from 'src/dto/user/users.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly _usersService;
    constructor(_usersService: UsersService);
    addUser(usersDto: UsersDto): Promise<import("mongoose").Document<unknown, any, import("../../interface/user/users.interface").UsersInterface> & import("../../interface/user/users.interface").UsersInterface & {
        _id: string;
    }>;
    updateUser(usersDto: UsersDto): Promise<import("mongodb").UpdateResult>;
    deleteUser(id: string): Promise<import("mongodb").UpdateResult>;
    geUserById(id: string): Promise<any[]>;
    getAllUsers(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
