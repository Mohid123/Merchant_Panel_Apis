import { Model } from 'mongoose';
import { UpdateHoursDto } from '../../dto/user/updatehours.dto';
import { UsersInterface } from '../../interface/user/users.interface';
export declare class UsersService {
    private readonly _userModel;
    constructor(_userModel: Model<UsersInterface>);
    addUser(usersDto: any): Promise<import("mongoose").Document<unknown, any, UsersInterface> & UsersInterface & {
        _id: string;
    }>;
    completeKYC(kycDto: any): Promise<import("mongodb").UpdateResult>;
    updateMerchantprofile(usersDto: any): Promise<import("mongodb").UpdateResult>;
    updateBusinessHours(updateHoursDTO: UpdateHoursDto): Promise<import("mongodb").UpdateResult>;
    deleteUser(id: any): Promise<import("mongodb").UpdateResult>;
    getUserById(id: any): Promise<any[]>;
    getMerchantStats(id: any): Promise<any>;
    getAllUsers(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
