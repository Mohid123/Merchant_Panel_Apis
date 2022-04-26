import { Model } from 'mongoose';
import { UsersInterface } from '../../interface/user/users.interface';
export declare class UsersService {
    private readonly _userModel;
    constructor(_userModel: Model<UsersInterface>);
    addUser(usersDto: any): Promise<import("mongoose").Document<unknown, any, UsersInterface> & UsersInterface & {
        _id: string;
    }>;
    completeKYC(kycDto: any): Promise<import("mongodb").UpdateResult>;
    updateUser(usersDto: any): Promise<import("mongodb").UpdateResult>;
    deleteUser(id: any): Promise<import("mongodb").UpdateResult>;
    geUserById(id: any): Promise<any[]>;
    getAllUsers(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
